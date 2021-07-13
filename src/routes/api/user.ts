import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../config';
const { JWT_SECRET } = config;

import User from '../../models/user';
import { IUser } from '../../types/user.types';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error('No users found');
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: 'Invalid request. Please fill out all the required field' });
  }

  User.findOne({ email }).then((user: IUser) => {
    if (user)
      return res
        .status(400)
        .json({ msg: 'This email address already exists.' });
    const newUser = new User({
      name,
      email,
      password,
    });
    bcrypt.genSalt(10, (_err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user: any) => {
          /* Temporarily using type 'any', change when the type is confirmed */
          jwt.sign(
            { id: user.id },
            JWT_SECRET as string,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

export default router;
