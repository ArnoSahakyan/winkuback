const { uploadMiddleware } = require('../middleware/uploads');
const { controllerUserImages } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.post('/api/upload/user-images', verifyToken, uploadMiddleware.single('file'), controllerUserImages);

  app.post('/api/upload/posts', verifyToken, uploadMiddleware.single('file'), (req, res) => {
    res.json(req.file);
  });
};