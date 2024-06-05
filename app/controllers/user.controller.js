const db = require("../models");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateUserData = async (req, res) => {
  const userId = req.userId;
  const { fname, job } = req.body;
  try {
    const user = await db.user.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.fname = fname !== undefined ? fname : user.fname;
    user.job = job !== undefined ? job : user.job;
    await user.save();

    const response = {
      fname: user.fname,
      job: user.job
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
}

exports.updateUserStatus = async (req, res) => {
  const userId = req.userId;
  const { onlineStatus } = req.body;
  try {
    const user = await db.user.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.onlineStatus = onlineStatus !== undefined ? onlineStatus : user.onlineStatus;
    await user.save();

    res.status(200).json({ onlineStatus: user.onlineStatus });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'An error occurred while updating the user status' });
  }
}