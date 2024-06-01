const db = require("../models");

exports.createPost = async (req, res) => {
  const userId = req.userId;
  const relativePath = req.file ? req.file.relativePath : null;;
  const content = req.body.content || null;

  try {
    const post = await db.post.create({
      userId: userId,
      content: content,
      image: relativePath
    });

    const fullPost = await db.post.findByPk(post.dataValues.postId, {
      include: {
        model: db.user,
        attributes: ['fname', 'pfp']
      }
    });

    const response = {
      postId: fullPost.postId,
      likes: fullPost.likes,
      createdAt: fullPost.createdAt,
      fname: fullPost.user.fname,
      pfp: fullPost.user.pfp,
      userId: fullPost.userId
    };

    if (fullPost.content) {
      response.content = fullPost.content;
    }

    if (fullPost.image) {
      response.image = fullPost.image;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Error fetching full post:", error);
    res.status(500).json({ error: 'Error creating post' });
  }
}

exports.getAllPostsByUser = async (req, res) => {
  const userId = req.userId;

  try {
    const posts = await db.post.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.user,
          attributes: ['fname', 'pfp']
        },
        {
          model: db.comment,
          attributes: ['commentId', 'content', 'parentId', 'createdAt'],
          include: {
            model: db.user,
            attributes: ['fname', 'pfp']
          }
        }
      ]
    });

    const response = posts.map(post => {
      return {
        postId: post.postId,
        content: post.content,
        image: post.image,
        likes: post.likes,
        createdAt: post.createdAt,
        fname: post.user.fname,
        pfp: post.user.pfp,
        userId: post.userId,
        comments: post.comments.map(comment => ({
          commentId: comment.commentId,
          content: comment.content,
          parentId: comment.parentId,
          createdAt: comment.createdAt,
          fname: comment.user.fname,
          pfp: comment.user.pfp
        }))
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: 'Error fetching posts by user' });
  }
};

exports.getNewsfeed = async (req, res) => {
  const userId = req.userId;

  try {
    const posts = await db.post.findAll({
      where: {
        userId: {
          [db.Sequelize.Op.ne]: userId // Not equal to userId
        }
      },
      include: [
        {
          model: db.user,
          attributes: ['fname', 'pfp']
        },
        {
          model: db.comment,
          attributes: ['commentId', 'content', 'parentId', 'createdAt'],
          include: {
            model: db.user,
            attributes: ['fname', 'pfp']
          }
        }
      ]
    });

    const response = posts.map(post => {
      return {
        postId: post.postId,
        content: post.content,
        image: post.image,
        likes: post.likes,
        createdAt: post.createdAt,
        fname: post.user.fname,
        pfp: post.user.pfp,
        userId: post.userId,
        comments: post.comments.map(comment => ({
          commentId: comment.commentId,
          content: comment.content,
          parentId: comment.parentId,
          createdAt: comment.createdAt,
          fname: comment.user.fname,
          pfp: comment.user.pfp
        }))
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts not by user:", error);
    res.status(500).json({ error: 'Error fetching posts not by user' });
  }
};