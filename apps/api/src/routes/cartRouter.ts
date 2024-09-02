import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { messages } from 'joi-translation-pt-br';

import { CartController } from '../controllers/CartController';
import { setCartItems } from '../middlewares/setCartItems';
import { userAuth } from '../middlewares/userAuth';

const cart = new CartController();
const router = Router();

router.get('/cart', setCartItems, cart.view);

router.post('/cart/sync', userAuth, setCartItems, cart.sync);

router.put(
  '/cart/:id',
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
  setCartItems,
  cart.add,
);

router.delete(
  '/cart/:id',
  celebrate(
    {
      [Segments.HEADERS]: Joi.object({
        cart_items: Joi.string().required(),
      }).options({ allowUnknown: true }),
      [Segments.PARAMS]: {
        id: Joi.string().uuid({ version: 'uuidv4' }).required(),
      },
    },
    {
      messages: messages,
    },
  ),
  setCartItems,
  cart.remove,
);

router.get(
  '/cart/buy',
  celebrate(
    {
      [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
        cart_items: Joi.string().required(),
      }).options({ allowUnknown: true }),
    },
    {
      messages: messages,
    },
  ),
  userAuth,
  setCartItems,
  cart.buy,
);

export { router };
