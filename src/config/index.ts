import dotenv from 'dotenv';
dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
};
