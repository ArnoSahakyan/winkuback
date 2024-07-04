const { uploadMiddleware, compressImageMiddleware } = require('../middleware/uploads');
const { controllerUserImages } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.post('/api/upload/user-images', verifyToken, uploadMiddleware.single('file'), compressImageMiddleware, controllerUserImages);
};