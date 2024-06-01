module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    commentId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    postId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    parentId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
  });

  return Comment;
};
