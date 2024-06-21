const db = require("../models");

exports.saveMessage = async (req, res) => {
  const { senderId, receiverId, message, roomId } = req.body;

  try {
    const newMessage = await db.message.create({
      senderId,
      receiverId,
      message,
      roomId
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Error saving message' });
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.params;

  try {
    const messages = await db.message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};
