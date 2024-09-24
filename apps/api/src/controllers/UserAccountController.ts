import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { deleteImg } from '../lib/deleteImg';
import { uploadImg } from '../lib/uploadImg';
import { User } from '../models/User';

export class UserAccountController {
  account = async (req: Request, res: Response) => {
    try {
      const user = await User.findFirst({
        where: { id: req.id },
        include: {
          games: {
            select: {
              game: {
                select: {
                  id: true,
                  title: true,
                  year: true,
                  imageUrl: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      return res.json({
        user: {
          id: user.id,
          avatar: user.avatarUrl,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          games: user.games.map((i) => i.game),
        },
        cartItems: user.cartItems,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const id = req.id;

      const existingUser = await User.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (data?.username) {
        const userByUsername = await User.findFirst({
          where: { username: { equals: data.username, mode: 'insensitive' } },
        });

        if (userByUsername && userByUsername.id !== id) {
          return res.status(409).json({ error: 'Username in use' });
        }
      }

      if (data?.email) {
        const userByEmail = await User.findFirst({
          where: { email: { equals: data.email, mode: 'insensitive' } },
        });

        if (userByEmail && userByEmail.id !== id) {
          return res.status(409).json({ error: 'Email in use' });
        }
      }

      if (data?.email || data?.new_password) {
        if (!data?.password) {
          return res.status(400).json({ error: 'Password is required' });
        }
      }

      if (data?.password) {
        const check = await bcrypt.compare(data.password, existingUser.password);

        if (!check) {
          return res.status(401).json({ error: 'Password is wrong' });
        }
      }

      const hash = data?.new_password
        ? await bcrypt.hash(data.new_password, 10)
        : undefined;

      const updateData = {
        email: data?.email?.toLowerCase(),
        username: data?.username,
        password: hash,
      };

      await User.update({
        where: { id },
        data: { ...updateData },
      });

      return res.json({
        ...updateData,
        password: undefined,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = req.id;

    const { password } = req.body;

    try {
      const user = await User.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (user.isAdmin) {
        return res.status(401).json({ error: `Admin's can't delete your account` });
      }

      const check = await bcrypt.compare(password, user.password);

      if (!check) {
        return res.status(401).json({ error: 'Password is wrong' });
      }

      await User.delete({ where: { username: user.username } });

      if (user.avatarUrl) {
        await deleteImg(user.avatarUrl);
      }

      return res.status(200).json({ info: 'Account Deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  changeAvatar = async (req: Request, res: Response) => {
    try {
      const id = req.id;

      const user = await User.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File cannot be empty' });
      }

      const avatarUrl = (await uploadImg(req)) as string | undefined;

      if (avatarUrl === 'error') {
        return res.status(400).json({ error: 'Invalid file format' });
      }

      await User.update({ where: { id }, data: { avatarUrl } });

      if (user.avatarUrl) {
        await deleteImg(user.avatarUrl);
      }

      return res.json({ avatar: avatarUrl });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
