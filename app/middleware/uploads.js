const multer = require('multer');
const sharp = require('sharp');

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const compressImageMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const buffer = await sharp(req.file.buffer)
      .resize(1200)
      .webp({ quality: 85 })
      .toBuffer();

    req.file.buffer = buffer;
    req.file.mimetype = 'image/webp';
    req.file.originalname = req.file.originalname.replace(/\.\w+$/, '.webp');

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};

module.exports = {
  uploadMiddleware,
  compressImageMiddleware
};
