import { NextFunction, Request, Response } from 'express';

export const setCartItems = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers.cookie;
  const cart_items = cookie
    ? cookie.replace('cart_items=', '')
    : (req.headers.cart_items as string);
  req.cart_items = cart_items;
  next();
};
