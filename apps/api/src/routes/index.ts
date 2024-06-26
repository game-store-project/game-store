import { errors } from 'celebrate';
import { Router } from 'express';
const router = Router();

import { router as cartRouter } from './cartRouter';
import { router as gameRouter } from './gameRouter';
import { router as genreRouter } from './genreRouter';
import { router as userRouter } from './userRouter';

router.use(errors());

router.use('/api/v1', genreRouter);
router.use('/api/v1', userRouter);
router.use('/api/v1', gameRouter);
router.use('/api/v1', cartRouter);

export { router };
