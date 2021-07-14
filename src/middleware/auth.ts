import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

const { JWT_SECRET } = config;

const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export default auth;
