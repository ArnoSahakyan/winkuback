const supabase = require("../../supabaseClient");
const db = require("../models");

exports.createPost = async (req, res) => {
  const userId = req.userId;
  const { file } = req;
  const content = req.body.content || null;

  let newURL = null;

  // Check if file is provided and process it
  if (file) {
    const filePath = `${userId}/posts/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase
      .storage
      .from('winku')
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    newURL = `${process.env.SUPABASE_IMAGE_URL}winku/${data.path}`;
  }

  try {
    // Create a new post
    const post = await db.post.create({
      userId: userId,
      content: content,
      image: newURL
    });

    // Fetch the full post with user details
    const fullPost = await db.post.findByPk(post.dataValues.postId, {
      include: {
        model: db.user,
        attributes: ['fname', 'pfp']
      }
    });

    // Construct the response
    const response = {
      postId: fullPost.postId,
      likeCount: fullPost.likeCount,
      createdAt: fullPost.createdAt,
      fname: fullPost.user.fname,
      pfp: fullPost.user.pfp,
      userId: fullPost.userId,
      content: fullPost.content || null,
      image: fullPost.image || null
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: 'Error creating post' });
  }
}


exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await db.post.findOne({ where: { postId: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await db.comment.destroy({ where: { postId: postId } });

    const existingImagePath = post.image;

    if (existingImagePath) {
      const existingFilePath = existingImagePath.replace(`${process.env.SUPABASE_IMAGE_URL}winku/`, '');

      const { data: deleteData, error: deleteError } = await supabase
        .storage
        .from('winku')
        .remove([existingFilePath]);

      if (deleteError) {
        console.error('Error deleting existing image:', deleteError.message);
      } else if (!deleteData || deleteData.length === 0) {
        console.error('Failed to delete file. File not found:', existingFilePath);
      }
    }

    await post.destroy();

    res.status(200).json({ message: 'Post deleted successfully', postId: postId });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
}

exports.getAllPostsByUser = async (req, res) => {
  const userId = req.userId;
  const { limit = 3, offset = 0 } = req.query;

  try {
    const { count, rows: posts } = await db.post.findAndCountAll({
      where: { userId: userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: db.user,
          attributes: ['fname', 'pfp']
        },
        {
          model: db.comment,
          where: { parentId: null },
          required: false,
          attributes: ['commentId', 'content', 'parentId', 'createdAt'],
          include: [
            {
              model: db.user,
              attributes: ['fname', 'pfp']
            },
            {
              model: db.comment,
              as: 'replies',
              include: {
                model: db.user,
                attributes: ['fname', 'pfp']
              },
              order: [['createdAt', 'DESC']]
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Check if the user has liked each post
    const postIds = posts.map(post => post.postId);
    const likes = await db.like.findAll({
      where: {
        userId: userId,
        postId: postIds
      },
      attributes: ['postId']
    });

    const likedPosts = likes.map(like => like.postId);

    const response = posts.map(post => ({
      postId: post.postId,
      content: post.content,
      image: post.image,
      likeCount: post.likeCount,
      createdAt: post.createdAt,
      fname: post.user.fname,
      pfp: post.user.pfp,
      userId: post.userId,
      likedByUser: likedPosts.includes(post.postId),
      comments: post.comments.length > 0 ? post.comments.map(comment => ({
        commentId: comment.commentId,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        fname: comment.user.fname,
        pfp: comment.user.pfp,
        replies: comment.replies.length > 0 ? comment.replies.map(reply => ({
          commentId: reply.commentId,
          content: reply.content,
          parentId: reply.parentId,
          createdAt: reply.createdAt,
          fname: reply.user.fname,
          pfp: reply.user.pfp
        })) : null
      })) : null
    }));

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Math.floor(offset / limit) + 1,
      data: response
    });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: 'Error fetching posts by user' });
  }
};


exports.getNewsfeed = async (req, res) => {
  const userId = req.userId;
  const { limit = 3, offset = 0 } = req.query;

  try {
    const { count, rows: posts } = await db.post.findAndCountAll({
      where: { userId: { [db.Sequelize.Op.ne]: userId } },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: db.user,
          attributes: ['fname', 'pfp']
        },
        {
          model: db.comment,
          where: { parentId: null },
          required: false,
          attributes: ['commentId', 'content', 'parentId', 'createdAt'],
          include: [
            {
              model: db.user,
              attributes: ['fname', 'pfp']
            },
            {
              model: db.comment,
              as: 'replies',
              include: {
                model: db.user,
                attributes: ['fname', 'pfp']
              },
              order: [['createdAt', 'DESC']]
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Check if the user has liked each post
    const postIds = posts.map(post => post.postId);
    const likes = await db.like.findAll({
      where: {
        userId: userId,
        postId: postIds
      },
      attributes: ['postId']
    });

    const likedPosts = likes.map(like => like.postId);

    const response = posts.map(post => ({
      postId: post.postId,
      content: post.content,
      image: post.image,
      likeCount: post.likeCount,
      createdAt: post.createdAt,
      fname: post.user.fname,
      pfp: post.user.pfp,
      userId: post.userId,
      likedByUser: likedPosts.includes(post.postId),
      comments: post.comments.length > 0 ? post.comments.map(comment => ({
        commentId: comment.commentId,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        fname: comment.user.fname,
        pfp: comment.user.pfp,
        replies: comment.replies.length > 0 ? comment.replies.map(reply => ({
          commentId: reply.commentId,
          content: reply.content,
          parentId: reply.parentId,
          createdAt: reply.createdAt,
          fname: reply.user.fname,
          pfp: reply.user.pfp
        })) : null
      })) : null
    }));

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Math.floor(offset / limit) + 1,
      data: response
    });
  } catch (error) {
    console.error("Error fetching posts not by user:", error);
    res.status(500).json({ error: 'Error fetching posts not by user' });
  }
};
