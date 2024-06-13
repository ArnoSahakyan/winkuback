const { getFriends, deleteFriend, getUnassociatedUsers } = require('../controllers/friend.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.get('/api/friends', verifyToken, getFriends);
  app.get('/api/unassociated-users', verifyToken, getUnassociatedUsers)
  app.delete('/api/delete-friend/:friendId', verifyToken, deleteFriend);

};