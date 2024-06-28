const { user } = require("../models");
const supabase = require('../../supabaseClient');
const db = require("../models");

exports.updatePath = async (userId, path, fieldKey) => {
  try {
    const userRecord = await user.findByPk(userId);
    if (userRecord) {
      await userRecord.update({ [fieldKey]: path });
    } else {
      console.error('User not found');
    }
  } catch (err) {
    console.error('Failed to update profile picture path:', err);
  }
};

exports.controllerUserImages = async (req, res) => {
  try {
    const userId = req.userId;
    const { file } = req;
    const { type } = req.body;

    if (!file || !userId) {
      return res.status(400).json({ error: 'Incomplete request' });
    }

    const user = await db.user.findOne({ where: { id: userId }, attributes: [type] });
    const existingImagePath = user ? user[type] : null;

    if (existingImagePath) {
      const existingFilePath = existingImagePath.replace(`${process.env.SUPABASE_IMAGE_URL}winku/`, '');

      if (existingFilePath == 'default/pfp.jpg' || existingFilePath == 'default/cover.jpg') return;

      const { data: deleteData, error: deleteError } = await supabase
        .storage
        .from('winku')
        .remove([existingFilePath]);

      if (deleteError) {
        console.error('Error deleting existing profile picture:', deleteError.message);
      } else if (!deleteData || deleteData.length === 0) {
        console.error('Failed to delete file. File not found:', existingFilePath);
      }
    }

    const filePath = `${userId}/${type}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase
      .storage
      .from('winku')
      .upload(filePath, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    const newURL = `${process.env.SUPABASE_IMAGE_URL}${data.fullPath}`;

    await db.user.update({ [type]: newURL }, { where: { id: userId } });

    res.json({ [type]: newURL, type });

  } catch (error) {
    console.error('Failed to update profile picture path:', error);
    res.status(500).send('Internal server error');
  }
};
