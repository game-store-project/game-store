import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { User } from '../models/User';
import { createTokenJwt } from '../utils/jwtFunctions';

export class UserAuthController {
  signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
      const [existingUserByUsername, existingUserByEmail] = await Promise.all([
        User.findFirst({
          where: { username: { equals: username, mode: 'insensitive' } },
        }),
        User.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
        }),
      ]);

      if (existingUserByUsername)
        return res.status(409).json({ error: 'Username in use' });

      if (existingUserByEmail) return res.status(409).json({ error: 'Email in use' });

      const hash = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: hash,
      };

      await User.create({ data: { ...newUser } });
      return res.status(201).json({ info: 'Account created' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const userCheck = await User.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

      if (userCheck) {
        const checkPassword = await bcrypt.compare(password, userCheck.password);

        if (checkPassword) {
          const token = createTokenJwt(userCheck.id);

          return res.json({
            token,
            user: {
              id: userCheck.id,
              avatar: userCheck.avatarUrl,
              username: userCheck.username,
              email: userCheck.email,
              isAdmin: userCheck.isAdmin,
            },
            cartItems: userCheck.cartItems,
          });
        } else return res.status(401).json({ error: 'Invalid credentials' });
      } else return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
