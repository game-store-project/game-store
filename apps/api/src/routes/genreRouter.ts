import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { messages } from 'joi-translation-pt-br';

import { GenreController } from '../controllers/GenreController';
import { adminAuth } from '../middlewares/adminAuth';

const genre = new GenreController();
const router = Router();

router.get('/genres', adminAuth, genre.read);

router.post(
  '/genres',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
      }),
    },
    {
      messages: messages,
    },
  ),
  adminAuth,
  genre.create,
);

router.get(
  '/genres/:id',
  celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string().required(),
      },
    },
    {
      messages: messages,
    },
  ),
  adminAuth,
  genre.find,
);

router.put(
  '/genres/:id',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
      }),
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required(),
      },
    },
    {
      messages: messages,
    },
  ),
  adminAuth,
  genre.edit,
);

router.delete(
  '/genres/:id',
  celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required(),
      },
    },
    {
      messages: messages,
    },
  ),
  adminAuth,
  genre.remove,
);

export { router };
