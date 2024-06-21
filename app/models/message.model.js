module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("messages", {
    messageId: {
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
    message: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
    {
      timestamps: false
    });

  return Message;
};
