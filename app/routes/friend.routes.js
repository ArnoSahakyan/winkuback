const { getFriends, deleteFriend } = require('../controllers/friend.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.get('/api/friends', verifyToken, getFriends)
  app.delete('/api/delete-friend', verifyToken, deleteFriend)
};