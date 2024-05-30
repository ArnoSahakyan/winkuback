const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the base upload directory exists
const baseUploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Utility function to handle directory creation and file removal
const setupDirectory = (userUploadDir, cb) => {
  if (!fs.existsSync(userUploadDir)) {
    fs.mkdirSync(userUploadDir, { recursive: true });
    cb(null, userUploadDir);
  } else {
    // Delete existing files in the user's upload directory
    fs.readdir(userUploadDir, (err, files) => {
      if (err) return cb(err);

      for (const file of files) {
        fs.unlink(path.join(userUploadDir, file), err => {
          if (err) return cb(err);
        });
      }
      cb(null, userUploadDir);
    });
  }
};

const createStorage = (subDir) => multer.diskStorage({
  destination: function (req, file, cb) {
    const userID = req.body.userID; // Get userID from the request body
    const userUploadDir = path.join(baseUploadDir, userID.toString(), subDir); // Create a directory for the user
    setupDirectory(userUploadDir, cb);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    const ext = path.extname(file.originalname);
    const imageName = `${Date.now()}${ext}`;
    file.relativePath = `/upload/${req.body.userID}/${subDir}/${imageName}`; // Store the relative path in the file object
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
