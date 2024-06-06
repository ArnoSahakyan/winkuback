module.exports = (sequelize, Sequelize) => {
  const FriendRequest = sequelize.define("friendRequests", {
    requestId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending', // Other values: 'accepted', 'rejected'
    }
  });

  return FriendRequest;
};
