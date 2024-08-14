import { Request, Response } from 'express';
import { User } from '../models/User';

export class UserAdminController {
  read = async (req: Request, res: Response) => {
    try {
      const array = await User.findMany({ orderBy: { username: 'asc' } });

      const users = array.map((user) => {
        return {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        };
      });

      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  alter = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await User.findUnique({ where: { id } });

      if (user) {
        if (user.id != req.id) {
          user.isAdmin
            ? await User.update({ where: { id: user.id }, data: { isAdmin: false } })
            : await User.update({ where: { id: user.id }, data: { isAdmin: true } });

          return res.status(200).json({
            user: { username: user.username, isAdmin: !user.isAdmin },
          });
        } else {
          return res
            .status(401)
            .json({ error: `You're not allowed to change your permission` });
        }
      } else return res.status(404).json({ error: `The user doesn't exist` });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
