const db = require("../models");

exports.getFriends = async (req, res) => {
  const userId = req.userId;

  try {
    const friends = await db.friend.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { userId: userId },
          { friendId: userId }
        ]
      }
    });

    const friendList = friends.map(friend => {
      return friend.userId === userId ? friend.friendId : friend.userId;
    });

    const users = await db.user.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: friendList
        }
      },
      attributes: ['id', 'fname', 'username', 'pfp', 'job', 'email', 'onlineStatus']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Error fetching friends' });
  }
};


exports.deleteFriend = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.userId;
  try {
    const friend = await db.friend.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    await friend.destroy();
    res.status(200).json({ message: 'Friend deleted successfully', friendId: friendId });
  } catch (error) {
    console.error('Error deleting friend:', error);
    res.status(500).json({ error: 'Error deleting friend' });
  }
};

exports.getUnassociatedUsers = async (req, res) => {
  const userId = req.userId; // Assuming you have middleware to set req.userId
  try {
    // Get all friend ids
    const friends = await db.friend.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { userId },
          { friendId: userId }
        ]
      },
      attributes: ['userId', 'friendId']
    });

    // Get all pending friend request ids
    const friendRequests = await db.friendRequest.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      attributes: ['senderId', 'receiverId']
    });

    // Extract all associated user ids
    const associatedUserIds = new Set();
    friends.forEach(friend => {
      associatedUserIds.add(friend.userId);
      associatedUserIds.add(friend.friendId);
    });

    friendRequests.forEach(request => {
      associatedUserIds.add(request.senderId);
      associatedUserIds.add(request.receiverId);
    });

    // Add the current user's id to the set to exclude it
    associatedUserIds.add(userId);

    // Find all users not in the associatedUserIds set
    const unassociatedUsers = await db.user.findAll({
      where: {
        id: { [db.Sequelize.Op.notIn]: Array.from(associatedUserIds) }
      },
      attributes: ['id', 'fname', 'username', 'job', 'pfp'] // Adjust attributes as necessary
    });

    res.status(200).json(unassociatedUsers);
  } catch (error) {
    console.error('Error fetching unassociated users:', error);
    res.status(500).json({ error: 'Error fetching unassociated users' });
  }
};