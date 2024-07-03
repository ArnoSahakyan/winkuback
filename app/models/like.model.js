module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("likes", {
    likeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    postId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Like;
};
