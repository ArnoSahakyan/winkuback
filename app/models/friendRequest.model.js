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
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    }
  });

  return FriendRequest;
};
