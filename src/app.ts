import express from 'express';

// DB
import mongoose from 'mongoose';

// Config
import config from './config';

// Middlewares
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const { MONGO_URL } = config;

app.use(hpp());
app.use(helmet());
app.use(cors({ credentials: true }));
app.use(morgan('dev'));

app.use(express.json());

mongoose
  .connect(MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.log(e));

app.get('/');

export default app;
