const { createPost, getAllPostsByUser, getNewsfeed, deletePost } = require('../controllers/post.controller');
const { verifyToken } = require('../middleware/authJwt');
const { uploadMiddleware, compressImageMiddleware } = require('../middleware/uploads');

module.exports = function (app) {
  app.post('/api/post', verifyToken, uploadMiddleware.single('file'), compressImageMiddleware, createPost);

  app.delete('/api/delete-post/:postId', verifyToken, deletePost);

  app.get('/api/user-posts', verifyToken, getAllPostsByUser)

  app.get('/api/posts', verifyToken, getNewsfeed)
};