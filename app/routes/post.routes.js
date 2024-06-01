const { createPost, getAllPostsByUser, getNewsfeed } = require('../controllers/post.controller');
const { verifyToken } = require('../middleware/authJwt');
const { uploadPostImages } = require('../middleware/uploads');

module.exports = function (app) {
  app.post('/api/post', verifyToken, uploadPostImages.single('file'), createPost);

  app.get('/api/userPosts', verifyToken, getAllPostsByUser)

  app.get('/api/newsfeed', verifyToken, getNewsfeed)
};