import express from 'express';
import Post from '../../models/post';

const router = express.Router();

// api/post
router.get('/', async (_req, res) => {
  const postFindRes = await Post.find();
  res.json(postFindRes);
});

router.post('/', async (req, res) => {
  try {
    const { title, content, fileUrl, creator } = req.body;
    const newPost = await Post.create({ title, content, fileUrl, creator });
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

export default router;
