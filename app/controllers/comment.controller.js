const db = require("../models");

exports.createComment = async (req, res) => {
  const { postId, content, parentId } = req.body;
  const userId = req.userId;

  console.log({ postId, content, parentId });

  try {
    const comment = await db.comment.create({
      userId: userId,
      postId: postId,
      parentId: parentId || null,
      content: content
    });

    console.log("AAA", comment);

    const fullComment = await db.comment.findByPk(comment.commentId, {
      include: {
        model: db.user,
        attributes: ['fname', 'pfp']
      }
    })

    res.status(201).json(fullComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: 'Error creating comment' });
  }
};
