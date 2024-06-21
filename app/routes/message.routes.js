const { saveMessage, getMessages } = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/authJwt");
module.exports = function (app) {
  app.post("/api/messages", verifyToken, saveMessage);
  app.get("/api/messages/:friendId", verifyToken, getMessages);
}