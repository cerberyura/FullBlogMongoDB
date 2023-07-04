import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося получити всі статті',
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = (await PostModel.findOneAndUpdate(
      {_id: postId},
      {$inc: {viewsCount: 1}},
      {returnDocument: 'after'}
    ).populate('user').exec());

    if (!doc) {
      return res.json({
        message: 'Стаття не знайдена',
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося створити статтю',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findByIdAndRemove(postId);

    if (!doc) {
      return res.json({
        message: 'Стаття не видалена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося видалити статтю',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося створити статтю',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({_id: postId,},
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
        },
      );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося оновити статтю',
    });
  }
}

export const getLastTags = async (req, res) => {
  try{
    const posts = await PostModel.find().limit(3).exec();
    const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 3)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося получити теги',
    });
  }
}