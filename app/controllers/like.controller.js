const db = require('../models');

exports.likePost = async (req, res) => {
  try {
    const userId = req.userId
    const { postId } = req.body;

    // Check if the like already exists
    const existingLike = await db.like.findOne({ where: { userId, postId } });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post." });
    }

    // Create a new like
    await db.like.create({ userId, postId });

    // Increment the like count in the post
    await db.post.increment('likeCount', { by: 1, where: { postId } });

    res.status(201).json({ message: "Post liked successfully.", postId, userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const userId = req.userId
    const { postId } = req.body;

    // Check if the like exists
    const existingLike = await db.like.findOne({ where: { userId, postId } });
    if (!existingLike) {
      return res.status(400).json({ message: "You haven't liked this post." });
    }

    // Delete the like
    await db.like.destroy({ where: { userId, postId } });

    // Decrement the like count in the post
    await db.post.decrement('likeCount', { by: 1, where: { postId } });

    res.status(200).json({ message: "Post unliked successfully.", postId, userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
