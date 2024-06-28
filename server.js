require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import socket.io
const jwt = require("jsonwebtoken");

const corsOptions = {
  origin: process.env.CORS, // specify the origin
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: -1
};

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { // Initialize socket.io with the HTTP server
  cors: corsOptions
});

// Middleware and routes setup
app.use(cors(corsOptions));
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'app/upload')));
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((err) => {
  console.error('Error synchronizing the database:', err);
});

app.options('*', cors(corsOptions)); // handle preflight requests

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Winku application." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/upload.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/comment.routes')(app);
require('./app/routes/friend.routes')(app);
require('./app/routes/friendRequest.routes')(app);
require('./app/routes/message.routes')(app);

// Socket.IO setup
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket) => {
  const userId = socket.userId;

  // Join room
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  console.log("AAA");

  // Send message
  socket.on("send_message", async (data) => {
    // Save message to the database without room ID
    try {
      await db.message.create({
        senderId: userId,
        receiverId: data.receiverId,
        message: data.message
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Emit message to room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Start the server
const PORT = process.env.PORT || 7070;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
