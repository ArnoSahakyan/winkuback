const { createComment } = require('../controllers/comment.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.post('/api/comment', verifyToken, createComment);

};