import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const parser = multer({
  limits: {
    fileSize: 5_242_880, //5mb
  },
});

export const parserImg = async (req: Request, res: Response, next: NextFunction) => {
  parser.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'Error with file' });
    next();
  });
};
