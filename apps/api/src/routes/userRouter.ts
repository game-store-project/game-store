import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { messages } from 'joi-translation-pt-br';

import { UserAccountController } from '../controllers/UserAccountController';
import { UserAdminController } from '../controllers/UserAdminController';
import { UserAuthController } from '../controllers/UserAuthController';

import { adminAuth } from '../middlewares/adminAuth';
import { parserImg } from '../middlewares/parserImg';
import { userAuth } from '../middlewares/userAuth';

const uAuth = new UserAuthController();
const uAccount = new UserAccountController();
const uAdmin = new UserAdminController();

const router = Router();

router.post(
  '/users/signup',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        username: Joi.string()
          .pattern(/[A-Za-z0-9_]+/)
          .min(5)
          .max(40)
          .required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required(),
      }),
    },
    { messages },
  ),
  uAuth.signUp,
);

router.post(
  '/users/signin',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      }),
    },
    { messages },
  ),
  uAuth.signIn,
);

router.get('/users/account', userAuth, uAccount.account);

router.patch(
  '/users/account/avatar',
  parserImg,
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        image: Joi.allow(),
      }),
    },

    { messages },
  ),
  userAuth,
  uAccount.changeAvatar,
);

router.get('/users', adminAuth, uAdmin.read);

router.patch(
  '/users/:id',
  celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required(),
      },
    },
    { messages },
  ),
  adminAuth,
  uAdmin.alter,
);

router.put(
  '/users/account',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        username: Joi.string()
          .pattern(/[A-Za-z0-9_]+/)
          .min(5)
          .max(40)
          .optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        new_password: Joi.string().min(6).optional(),
        confirm_password: Joi.string().valid(Joi.ref('new_password')).optional(),
      }),
    },
    { messages },
  ),
  userAuth,
  uAccount.edit,
);

router.delete(
  '/users/account',
  celebrate(
    {
      [Segments.BODY]: Joi.object().keys({
        password: Joi.string().min(6).required(),
      }),
    },
    { messages },
  ),
  userAuth,
  uAccount.delete,
);

export { router };
