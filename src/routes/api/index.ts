import express from 'express';
import postRouter from './post';
import userRouter from './user';

const router = express.Router();

router.use('/post', postRouter);
router.use('/user', userRouter);

export default router;
