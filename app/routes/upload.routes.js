const { uploadPfp, uploadCoverImage, uploadPostImages } = require('../middleware/uploads');
const { controllerPfp, controllerCover } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.post('/api/upload/pfp', verifyToken, uploadPfp.single('file'), controllerPfp);

  app.post('/api/upload/cover', verifyToken, uploadCoverImage.single('file'), controllerCover);

  app.post('/api/upload/posts', uploadPostImages.single('file'), (req, res) => {
    res.json(req.file);
  });
};