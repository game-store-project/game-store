import { Request, Response } from 'express';
import { Game } from '../models/Game';
import { Genre } from '../models/Genre';

export class GenreController {
  read = async (req: Request, res: Response) => {
    try {
      const genres = await Genre.findMany({
        orderBy: { name: 'asc' },
        include: { _count: true },
      });

      return res.status(200).json({ genres });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      const genre = await Genre.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });

      if (genre) return res.status(409).json({ error: 'Genre already registered' });
      else {
        const genre = await Genre.create({ data: { name } });

        return res.status(201).json({ genreId: genre.id });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  find = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findUnique({ where: { id } });

      if (genre) return res.status(200).json({ genre });
      else return res.status(404).send('Content not found');
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { id } = req.params;

      const nameCheck = await Genre.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });

      const idCheck = await Genre.findUnique({ where: { id } });

      if (idCheck) {
        if (nameCheck && idCheck.id != nameCheck.id) {
          return res.status(409).json({ error: 'Genre already registered' });
        }

        await Genre.update({ where: { id }, data: { name } });

        return res.status(200).json({ info: 'Genre updated' });
      } else {
        return res.status(404).json({ error: 'Genre not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findUnique({ where: { id } });

      if (genre) {
        const gameCheck = await Game.findFirst({ where: { genreId: genre.id } });

        if (gameCheck)
          return res.status(409).json({ error: 'Genre registered in a game' });

        await Genre.delete({ where: { id } });

        return res.status(200).json({ info: 'Genre removed' });
      } else return res.status(404).json({ error: 'Genre not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
