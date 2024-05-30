const { uploadPfp, uploadCoverImage, uploadPostImages } = require('../middleware/uploads');
const { controllerPfp, controllerCover } = require('../controllers/upload.controller');

module.exports = function (app) {
  app.post('/api/upload/pfp', uploadPfp.single('file'), controllerPfp);

  app.post('/api/upload/cover', uploadCoverImage.single('file'), controllerCover);

  app.post('/api/upload/posts', uploadPostImages.single('files'), (req, res) => {
    res.json(req.file);
  });
};