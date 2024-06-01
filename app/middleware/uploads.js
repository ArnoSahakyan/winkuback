const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the base upload directory exists
const baseUploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Utility function to handle directory creation and file removal
const setupDirectory = (userUploadDir, subDir, cb) => {
  if (!fs.existsSync(userUploadDir)) {
    fs.mkdirSync(userUploadDir, { recursive: true });
    cb(null, userUploadDir);
  } else {
    // Only delete existing files if the directory is not 'posts'
    if (subDir !== 'posts') {
      fs.readdir(userUploadDir, (err, files) => {
        if (err) return cb(err);

        for (const file of files) {
          fs.unlink(path.join(userUploadDir, file), err => {
            if (err) return cb(err);
          });
        }
        cb(null, userUploadDir);
      });
    } else {
      cb(null, userUploadDir);
    }
  }
};

const createStorage = (subDir) => multer.diskStorage({
  destination: function (req, file, cb) {
    const userID = req.userId; // Get userID from the req object
    const userUploadDir = path.join(baseUploadDir, userID.toString(), subDir); // Create a directory for the user
    setupDirectory(userUploadDir, subDir, cb);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    const ext = path.extname(file.originalname);
    const imageName = `${Date.now()}${ext}`;
    file.relativePath = `/upload/${req.userId}/${subDir}/${imageName}`; // Store the relative path in the file object
    cb(null, imageName);
  }
});

// File filter to allow only images
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const uploadPfp = multer({
  storage: createStorage('pfp'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const uploadCoverImage = multer({
  storage: createStorage('cover'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const uploadPostImages = multer({
  storage: createStorage('posts'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

module.exports = {
  uploadPfp,
  uploadCoverImage,
  uploadPostImages
};
