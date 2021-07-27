import express from 'express';
import auth from '../../middleware/auth';
import Post from '../../models/post';

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import aws from 'aws-sdk';

import dotenv from 'dotenv';
dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'personalblog-spectre/upload',
    key(_req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const router = express.Router();

// api/post
router.get('/', async (_req, res) => {
  const postFindRes = await Post.find();
  res.json(postFindRes);
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, fileUrl, creator } = req.body;
    const newPost = await Post.create({ title, content, fileUrl, creator });
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

// api/post/image
router.post('/image', upload.array('upload', 5), async (req, res) => {
  try {
    const files = req.files as Express.MulterS3.File[];
    res.json({ uploaded: true, url: files.map((v) => v.location) });
  } catch (e) {
    console.error(e);
    res.json({ uploaded: false, url: null });
  }
});

export default router;
