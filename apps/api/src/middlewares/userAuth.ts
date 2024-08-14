import { NextFunction, Request, Response } from 'express';
import { verifyTokenJwt } from '../utils/jwtFunctions';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.replace('Bearer ', '') as string;

  try {
    const response = verifyTokenJwt(authorization);
    const tokenId = response as unknown as string;

    req.id = tokenId;

    return next();
  } catch (error) {
    switch (error && typeof error === 'object' && 'message' in error) {
      case 'jwt must be provided':
        return res.status(401).json({ error: 'Unauthorized' });
      case 'jwt expired':
        return res.status(401).json({ error: 'Unauthorized' });
      case 'invalid token':
        return res.status(401).json({ error: 'Unauthorized' });
      default:
        return res.status(500).json({ error: 'Unauthorized' });
    }
  }
};
