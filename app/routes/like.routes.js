const { likePost, unlikePost } = require("../controllers/like.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function (app) {
  app.post('/api/like', verifyToken, likePost);
  app.post('/api/unlike', verifyToken, unlikePost);
}
