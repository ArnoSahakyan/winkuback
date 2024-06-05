const db = require("../models");

exports.createComment = async (req, res) => {
  const { postId, content, parentId } = req.body;
  const userId = req.userId;

  try {
    const comment = await db.comment.create({
      userId: userId,
      postId: postId,
      parentId: parentId || null,
      content: content
    });

    const fullComment = await db.comment.findByPk(comment.commentId, {
      include: {
        model: db.user,
        attributes: ['fname', 'pfp']
      }
    })

    const response = {
      commentId: fullComment.commentId,
      postId: fullComment.postId,
      userId: fullComment.userId,
      parentId: fullComment.parentId,
      content: fullComment.content,
      createdAt: fullComment.createdAt,
      fname: fullComment.user.fname,
      pfp: fullComment.user.pfp
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: 'Error creating comment' });
  }
};