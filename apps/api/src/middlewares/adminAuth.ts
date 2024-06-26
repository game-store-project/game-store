import { NextFunction, Request, Response } from 'express';

import { User } from '../models/User';
import { verifyTokenJwt } from '../utils/jwtFunctions';

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.replace('Bearer ', '') as string;
  try {
    const response = verifyTokenJwt(authorization);
    const tokenId = response as unknown as string;

    const admin = await User.findUnique({ where: { id: tokenId } });

    if (admin?.isAdmin) {
      req.id = admin.id;

      return next();
    } else return res.status(400).json({ error: 'Not Authorized' });
  } catch (error: any) {
    switch (error.message) {
      case 'jwt must be provided':
        return res.status(400).json({ error: 'Not Authorized' });
      case 'jwt expired':
        return res.status(400).json({ error: 'Invalid Session' });
      case 'invalid token':
        return res.status(400).json({ error: 'Not Authorized' });
      default:
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
