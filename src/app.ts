import express from 'express';
import mongoose from 'mongoose';
import config from './config';

const app = express();
const { MONGO_URL } = config;

mongoose
  .connect(MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.log(e));

app.get('/');

export default app;
