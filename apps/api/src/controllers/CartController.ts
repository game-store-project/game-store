import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Game } from '../models/Game';
import { User } from '../models/User';
import { UserGames } from '../models/UserGames';

interface ICart {
  id: string;
}

export class CartController {
  view = async (req: Request, res: Response) => {
    const cart_items = req.cart_items;

    if (cart_items) {
      try {
        const decoded = jwt.decode(cart_items) as JwtPayload;

        if (decoded.cartItems.length > 0) {
          const games = await Game.findMany();

          const cartItems = decoded.cartItems
            .filter((dec: ICart) =>
              games.some((item) => item.id === dec.id && item.disponibility),
            )
            .map((dec: ICart) => {
              const game = games.find((item) => item.id === dec.id);

              if (game) {
                return {
                  id: game.id,
                  title: game.title,
                  year: game.year,
                  price: game.price,
                  imageUrl: game.imageUrl,
                  slug: game.slug,
                };
              }
            });

          return res.status(200).json({ cartItems });
        } else return res.status(200).json({ info: 'Empty Cart' });
      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else return res.status(200).json({ info: 'Empty Cart' });
  };

  add = async (req: Request, res: Response) => {
    const cart_items = req.cart_items;
    const { id } = req.params;

    try {
      const game = await Game.findUnique({ where: { id } });

      if (game) {
        const cartItems: ICart[] = [];

        if (cart_items) {
          const decoded = jwt.decode(cart_items) as JwtPayload;

          decoded.cartItems.map((item: ICart) => cartItems.push(item));
        }
        const check = cartItems.some((item) => item.id === game.id);

        if (!check) {
          cartItems.push({ id: game.id });
        }

        const message = check ? 'Item is already on the cart' : 'Item added on the cart';

        const token = check
          ? cart_items
          : jwt.sign(
              { id: randomUUID(), cartItems: cartItems },
              process.env.JWT_SECRET as string,
            );

        if (!check) {
          if (req.id) {
            await User.update({ where: { id: req.id }, data: { cartItems: token } });
          }
        }

        return res.status(check ? 400 : 201).json({
          info: !check ? message : undefined,
          error: check ? message : undefined,
          cartItems: token,
        });
      } else {
        return res.status(404).json({
          error: 'The game not exists',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const cart_items = req.cart_items;
      const { id } = req.params;

      if (cart_items) {
        const decoded = jwt.decode(cart_items) as JwtPayload;

        const check = decoded.cartItems.some((item: ICart) => item.id == id);
        if (check) {
          const cartItems = decoded.cartItems.filter((item: ICart) => item.id != id);

          const token = jwt.sign(
            { id: randomUUID(), cartItems: cartItems },
            process.env.JWT_SECRET as string,
          );

          if (req.id) {
            await User.update({ where: { id: req.id }, data: { cartItems: token } });
          }

          return res.status(200).json({
            info: 'Item removed to the cart',
            cartItems: token,
          });
        } else return res.status(404).json({ error: 'Content not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  buy = async (req: Request, res: Response) => {
    const cart_items = req.cart_items;

    try {
      const errorTitles: string[] = [];

      const userBuying = await User.findUnique({ where: { id: req.id } });

      if (cart_items && userBuying) {
        const userGames = await UserGames.findMany({ where: { userId: userBuying.id } });

        const decoded = jwt.decode(cart_items) as JwtPayload;

        await Promise.all(
          decoded.cartItems.map(async (item: ICart) => {
            const game = await Game.findUnique({
              where: { id: item.id, disponibility: true },
            });

            if (game) {
              const check = userGames.some((find) => find.gameId === game.id);

              !check
                ? await UserGames.create({
                    data: { userId: userBuying.id, gameId: game.id },
                  })
                : errorTitles.push(game.title);
            }
          }),
        );
      }

      await User.update({ where: { id: req.id }, data: { cartItems: null } });

      if (errorTitles.length > 0) {
        return res.json({ info: 'Titles added with exception', notAdded: errorTitles });
      } else {
        return res.status(201).json({ info: 'Titles added' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  sync = async (req: Request, res: Response) => {
    try {
      await User.update({ where: { id: req.id }, data: { cartItems: req.cart_items } });

      return res.status(201).json({ info: 'Cart synced' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
