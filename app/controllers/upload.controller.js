const { user } = require("../models");

exports.updatePath = async (userID, path, fieldKey) => {
  try {
    const userRecord = await user.findByPk(userID);
    if (userRecord) {
      await userRecord.update({ [fieldKey]: path });
    } else {
      console.error('User not found');
    }
  } catch (err) {
    console.error('Failed to update profile picture path:', err);
  }
};

exports.controllerPfp = async (req, res) => {
  try {
    const userID = req.userId;
    const relativePath = req.file.relativePath;

    await this.updatePath(userID, relativePath, "pfp");

    res.status(200).json({
      relativePath
    });
  } catch (error) {
    console.error('Failed to update profile picture path:', error);
    res.status(500).send('Internal server error');
  }
}

exports.controllerCover = async (req, res) => {
  try {
    const userID = req.userId;
    const relativePath = req.file.relativePath;

    await this.updatePath(userID, relativePath, "coverPhoto");

    res.status(200).json({
      relativePath
    });
  } catch (error) {
    console.error('Failed to update profile picture path:', error);
    res.status(500).send('Internal server error');
  }
}