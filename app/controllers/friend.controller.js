const db = require("../models");

exports.getFriends = async (req, res) => {
  const userId = req.userId;

  try {
    const friends = await db.friend.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: db.user,
        as: 'friend',
        attributes: ['id', 'fname', 'email', 'pfp', 'job']
      }]
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Error fetching friends' });
  }
};

exports.deleteFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.userId;

  try {
    const friend1 = await db.friend.findOne({
      where: {
        userId: userId,
        friendId: friendId
      }
    });

    const friend2 = await db.friend.findOne({
      where: {
        userId: friendId,
        friendId: userId
      }
    });

    if (!friend1 && !friend2) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Destroy both directions of the friendship if they exist
    if (friend1) await friend1.destroy();
    if (friend2) await friend2.destroy();

    res.status(200).json({ message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend:', error);
    res.status(500).json({ error: 'Error deleting friend' });
  }
}