const db = require('../models');

exports.respondToFriendRequest = async (req, res) => {
  const { senderId, status } = req.body;
  const userId = req.userId;
  try {
    const friendRequest = await db.friendRequest.findOne({
      where: {
        senderId: senderId,
        receiverId: userId,
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (senderId === userId) {
      return res.status(400).json({ message: "User can't send a request to themselves" });
    }

    if (status === 'accepted') {
      await db.friend.create({ userId: friendRequest.senderId, friendId: friendRequest.receiverId });
    }

    await friendRequest.destroy(); // Remove the request after response

    res.status(200).json({ message: `Friend request ${status}`, status, requestId: friendRequest.requestId });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    res.status(500).json({ error: 'Error responding to friend request' });
  }
};

exports.sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.userId;

  try {
    const existingRequest = await db.friendRequest.findOne({
      where: {
        senderId: senderId,
        receiverId: receiverId
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "User can't send a request to themselves" });
    }

    const existingFriend = await db.friend.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { userId: senderId, friendId: receiverId },
          { userId: receiverId, friendId: senderId }
        ]
      }
    });

    if (existingFriend) {
      return res.status(400).json({ message: 'User is already your friend' });
    }

    await db.friendRequest.create({
      senderId: senderId,
      receiverId: receiverId
    });

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Error sending friend request' });
  }
};

exports.getRequests = async (req, res) => {
  const userId = req.userId;

  try {
    const friendRequests = await db.friendRequest.findAll({
      where: {
        receiverId: userId
      },
      include: [{
        model: db.user,
        as: 'sender',
        attributes: ['id', 'fname', 'pfp']
      }]
    })


    const response = friendRequests.map(request => ({
      requestId: request.requestId,
      senderId: request.senderId,
      status: request.status,
      fname: request.sender.fname,
      pfp: request.sender.pfp
    }))
    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Error fetching requests' });
  }
}