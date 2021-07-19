import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../config';
const { JWT_SECRET } = config;

import User from '../../models/user';

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: 'Invalid request. Please fill out all the required field' });
  }

  User.findOne({ email }).then((user: any) => {
    if (!user)
      return res.status(401).json({ msg: 'Invalid username or password' });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(401).json({ msg: 'Invalid username or password' });
      jwt.sign(
        { id: user.id },
        JWT_SECRET as string,
        { expiresIn: '2 days' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    });
  });
});

export default router;
