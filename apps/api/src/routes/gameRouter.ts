import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { messages } from 'joi-translation-pt-br';

import { GameController } from '../controllers/GameController';
import { adminAuth } from '../middlewares/adminAuth';
import { parserImg } from '../middlewares/parserImg';

const game = new GameController();
const router = Router();

router.get('/index', game.index);

router.get(
  '/games/search',
  celebrate(
    {
      [Segments.QUERY]: Joi.object().keys({
        name: Joi.string().min(0),
        genre: Joi.number().integer(),
      }),
    },
    {
      messages: messages,
    },
  ),
  game.search,
);

router.get('/games', adminAuth, game.read);

router.get(
  '/games/:slug',
  celebrate(
    {
      [Segments.PARAMS]: {
        slug: Joi.string().required(),
      },
    },
    {
      messages: messages,
    },
  ),
  game.find,
);

router.post(
  '/games',
  parserImg,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().min(1).required(),
      year: Joi.number().integer().min(1950).max(2099).required(),
      price: Joi.number().precision(2).required(),
      description: Joi.string().required(),
      disponibility: Joi.boolean(),
      genre: Joi.string().uuid().required(),
    }),
  }),
  adminAuth,
  game.create,
);

router.put(
  '/games/:id',
  parserImg,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      image: Joi.allow(),
      title: Joi.string().min(1).required(),
      year: Joi.number().integer().min(1950).max(2099).required(),
      price: Joi.number().precision(2).required(),
      description: Joi.string().required(),
      disponibility: Joi.boolean(),
      genre: Joi.string().uuid().required(),
    }),
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(),
    },
  }),
  adminAuth,
  game.edit,
);

router.delete(
  '/games/:id',
  celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string().uuid({ version: 'uuidv4' }).required(),
      },
    },
    {
      messages: messages,
    },
  ),
  adminAuth,
  game.remove,
);

export { router };
