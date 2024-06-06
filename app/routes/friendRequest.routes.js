const { respondToFriendRequest, getRequests, sendFriendRequest } = require('../controllers/friendRequest.controller');
const { verifyToken } = require('../middleware/authJwt');

module.exports = function (app) {
  app.get('/api/requests', verifyToken, getRequests)
  app.post('/api/send-request', verifyToken, sendFriendRequest);
  app.post('/api/respond-request', verifyToken, respondToFriendRequest);
};