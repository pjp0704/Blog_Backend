import express from 'express';
import auth from '../../middleware/auth';
import Post from '../../models/post';

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import aws from 'aws-sdk';

import dotenv from 'dotenv';
import moment from 'moment';
import Category from '../../models/category';
import User from '../../models/user';
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

router.post('/', auth, upload.none(), async (req, res) => {
  try {
    const { title, content, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      content,
      fileUrl,
      creator,
      date: moment().format('YYYY-MM-DD hh:mm:ss'),
    });

    const result = await Category.findOne({
      categoryName: category,
    });

    if (result == null) {
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { post: newPost._id },
      });
    } else {
      await Category.findByIdAndUpdate(result._id, {
        $push: { posts: newPost._id },
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: result._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { post: newPost._id },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`);
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
