module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    postId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });

  return Post;
};
