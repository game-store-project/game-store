import { Request, Response } from 'express';
import slugify from 'slugify';

import { deleteImg } from '../lib/deleteImg';
import { uploadImg } from '../lib/uploadImg';
import { Game } from '../models/Game';

export class GameController {
  index = async (req: Request, res: Response) => {
    try {
      const games = await Game.findMany({
        orderBy: [{ disponibility: 'desc' }, { price: 'asc' }],
      });

      return res.status(200).json({ games });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  read = async (req: Request, res: Response) => {
    try {
      const games = await Game.findMany({
        include: { genre: true },
        orderBy: [{ title: 'asc' }],
      });

      return res.status(200).json({ games });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  find = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const game = await Game.findFirst({
        where: {
          slug: {
            equals: slug,
            mode: 'insensitive',
          },
        },
        include: { genre: true },
      });

      if (game) return res.status(200).json({ game });
      else return res.status(404).send('Content not found');
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { title, year, price, description, disponibility, genre } = <IGame>req.body;

      const game = await Game.findFirst({
        where: { title: { equals: title, mode: 'insensitive' } },
      });

      if (game) res.status(409).json({ error: 'Title already registered' });
      else {
        const imageUrl = (await uploadImg(req, res)) as string | undefined;

        if (!imageUrl) return res.status(400).json({ error: 'File cannot be empty' });
        else if (imageUrl === 'error')
          return res.status(400).json({ error: 'Invalid file format' });
        else {
          const newGame = {
            title,
            slug: slugify(title),
            year,
            price,
            imageUrl,
            description,
            disponibility,
            genreId: genre,
          };
          const game = await Game.create({ data: newGame });

          res.status(201).json({ gameId: game.id });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const { name, genre } = req.query;

      if (name && name !== '') {
        const games = await Game.findMany({
          where: { title: { contains: `${name}`, mode: 'insensitive' } },
          orderBy: [{ disponibility: 'desc' }, { price: 'asc' }],
        });

        return res.status(200).json({
          games: genre ? games.filter((game) => game.genreId == genre) : games,
        });
      } else if (genre && genre !== '') {
        const games = await Game.findMany({ where: { genreId: genre as string } });

        return res.status(200).json({ games });
      } else return res.status(400).json({ error: 'Query cannot be empty' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const { title, year, price, description, disponibility, genre } = <IGame>req.body;
      const { id } = req.params;

      const nameCheck = await Game.findFirst({
        where: { title: { equals: title, mode: 'insensitive' } },
      });

      const idCheck = await Game.findUnique({ where: { id } });

      if (idCheck) {
        if (nameCheck && nameCheck.id != idCheck.id) {
          res.status(409).json({ error: 'Title already registered' });
        }

        const imageUrl = req.file
          ? ((await uploadImg(req, res)) as string | undefined)
          : idCheck.imageUrl;

        if (!imageUrl) return res.status(400).json({ error: 'File cannot be empty' });

        if (imageUrl === 'error')
          return res.status(400).json({ error: 'Invalid file format' });

        const updateGame = {
          title,
          slug: slugify(title),
          year,
          price,
          imageUrl,
          description,
          disponibility,
          genreId: genre,
        };

        await Game.update({ where: { id }, data: { ...updateGame } });

        if (req.file) await deleteImg(idCheck.imageUrl);

        return res.status(200).json({ info: 'Game updated' });
      } else {
        return res.status(404).json({ error: 'Game not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const game = await Game.findUnique({ where: { id }, include: { users: true } });

      if (game) {
        if (game.users.length === 0) {
          const deletedImg = await deleteImg(game.imageUrl);

          if (deletedImg) {
            return res.status(500).json({ error: 'Internal server error' });
          }

          await Game.delete({ where: { id } });

          return res.status(200).json({ info: 'Game removed' });
        } else return res.status(401).json({ error: 'Game bought by an user' });
      } else return res.status(404).json({ error: 'Game not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
