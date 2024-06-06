module.exports = (sequelize, Sequelize) => {
  const Friend = sequelize.define("friends", {
    friendshipId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    friendId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  });

  return Friend;
};
