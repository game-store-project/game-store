import { NextFunction, Request, Response } from 'express';

import { User } from '../models/User';
import { verifyTokenJwt } from '../utils/jwtFunctions';

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.replace('Bearer ', '') as string;
  try {
    const response = verifyTokenJwt(authorization);
    const tokenId = response as unknown as string;

    const user = await User.findUnique({ where: { id: tokenId } });

    if (user?.isAdmin) {
      req.id = user.id;

      return next();
    } else return res.status(403).json({ error: 'Unauthorized' });
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      switch (error.message) {
        case 'jwt must be provided':
          return res.status(401).json({ error: 'Unauthorized' });
        case 'jwt expired':
          return res.status(401).json({ error: 'Unauthorized' });
        case 'invalid token':
          return res.status(401).json({ error: 'Unauthorized' });
        default:
          return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
};
