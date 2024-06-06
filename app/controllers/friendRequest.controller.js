const db = require('../models');

exports.respondToFriendRequest = async (req, res) => {
  const { requestId, status } = req.body; // status should be either 'accepted' or 'rejected'
  const userId = req.userId;

  try {
    const friendRequest = await db.friendRequest.findOne({
      where: {
        requestId: requestId,
        receiverId: userId,
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (status === 'accepted') {
      await db.friend.create({ userId: friendRequest.senderId, friendId: friendRequest.receiverId });
      await db.friend.create({ userId: friendRequest.receiverId, friendId: friendRequest.senderId });
    }

    await friendRequest.destroy(); // Remove the request after response

    res.status(200).json({ message: `Friend request ${status}` });
  } catch (error) {
    console.error('Error responding to friend request:', error);
    res.status(500).json({ error: 'Error responding to friend request' });
  }
};

exports.sendFriendRequest = async (req, res) => {
  const senderId = req.userId;
  const { receiverId } = req.body;

  try {
    const existingRequest = await db.friendRequest.findOne({
      where: {
        senderId: senderId,
        receiverId: receiverId,
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const friendRequest = await db.friendRequest.create({
      senderId: senderId,
      receiverId: receiverId,
      status: 'pending',
    });

    res.status(201).json(friendRequest);
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
    res.status(200).json(friendRequests);

  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Error fetching requests' });
  }
}