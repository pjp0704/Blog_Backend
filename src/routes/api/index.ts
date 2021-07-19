import express from 'express';
import postRouter from './post';
import userRouter from './user';
import authRouter from './auth';

const router = express.Router();

router.use('/post', postRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
