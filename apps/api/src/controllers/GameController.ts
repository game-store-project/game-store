import { Request, Response } from 'express';
import slugify from 'slugify';

import { Game as IGame } from '@prisma/client';
import { deleteImg } from '../lib/deleteImg';
import { uploadImg } from '../lib/uploadImg';
import { Game } from '../models/Game';
import {
  getBestSellers,
  getHighlights,
  getNewReleases,
  getRecomendedGames,
} from '../utils/gamesFunctions';

interface ISearch {
  search?: string;
  filter?: string;
}

export class GameController {
  index = async (req: Request, res: Response) => {
    try {
      const highlights = await getHighlights();
      const newReleases = await getNewReleases({ max: 6 });
      const recommended = await getRecomendedGames({ max: 6 });
      const bestSellers = await getBestSellers({ max: 6 });

      return res.status(200).json({
        highlights,
        newReleases,
        recommended,
        bestSellers,
      });
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

  getBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const game = await Game.findFirst({
        where: {
          slug: {
            equals: slug,
          },
          disponibility: true,
        },
        select: {
          id: true,
          title: true,
          year: true,
          price: true,
          imageUrl: true,
          description: true,
          genre: true,
        },
      });

      if (game) return res.status(200).json({ game });
      else return res.status(404).json({ error: 'Content not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const game = await Game.findFirst({
        where: {
          id,
        },
        include: { genre: true },
      });

      if (game) return res.status(200).json({ game });
      else return res.status(404).json({ error: 'Content not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { title, year, price, description, disponibility, genre } = req.body;

      const game = await Game.findFirst({
        where: { title: { equals: title, mode: 'insensitive' } },
      });

      if (game) {
        res.status(409).json({ error: 'Title already registered' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File cannot be empty' });
      }

      const imageUrl = await uploadImg(req);

      if (imageUrl === 'error') {
        return res.status(400).json({ error: 'Invalid file format' });
      }

      const newGame = {
        title,
        slug: slugify(title).toLowerCase(),
        year,
        price,
        imageUrl,
        description,
        disponibility,
        genreId: genre,
      };

      const createdGame = await Game.create({ data: newGame });

      res.status(201).json({ gameId: createdGame.id });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  search = async (req: Request, res: Response) => {
    const { search, filter } = <ISearch>req.query;

    let result: IGame[] = [];

    try {
      switch (filter) {
        case 'new-releases':
          result = await getNewReleases({ search });
          break;
        case 'recommended':
          result = await getRecomendedGames({ search });
          break;
        case 'best-sellers':
          result = await getBestSellers({ search });
          break;
        default:
          result = await Game.findMany({
            where: { title: { contains: search, mode: 'insensitive' } },
          });
      }
      return res.status(200).json({ games: result });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const { title, year, price, description, disponibility, genre } = req.body;
      const { id } = req.params;

      const nameCheck = await Game.findFirst({
        where: { title: { equals: title, mode: 'insensitive' } },
      });

      const idCheck = await Game.findUnique({ where: { id } });

      if (!idCheck) {
        return res.status(404).json({ error: 'Content not found' });
      }

      if (nameCheck && nameCheck.id !== idCheck.id) {
        res.status(409).json({ error: 'Title already registered' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File cannot be empty' });
      }

      const imageKey = idCheck.imageUrl.split('/').pop();

      const imageUrl =
        imageKey === req.file.originalname ? idCheck.imageUrl : await uploadImg(req);

      if (imageUrl === 'error') {
        return res.status(400).json({ error: 'Invalid file format' });
      }

      const updateGame = {
        title,
        slug: slugify(title).toLowerCase(),
        year,
        price,
        imageUrl,
        description,
        disponibility,
        genreId: genre,
      };

      await Game.update({ where: { id }, data: { ...updateGame } });

      if (idCheck.imageUrl !== imageUrl) {
        await deleteImg(idCheck.imageUrl);
      }

      return res.status(200).json({ info: 'Game updated' });
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
      } else return res.status(404).json({ error: 'Content not found' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
