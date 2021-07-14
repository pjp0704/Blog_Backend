/* eslint-disable no-unused-vars */
import User from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
