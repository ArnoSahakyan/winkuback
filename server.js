const express = require("express");
const cors = require("cors");
require('dotenv').config()
const path = require('path');


const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: -1
  })
);

// parse requests of content-type - application/json
app.use(express.json());

app.use('/upload', express.static(path.join(__dirname, 'app/upload')));


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

// force: true will drop the table if it already exists
// db.sequelize.sync().then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Winku application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/upload.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
  console.log(`Server is running on port http://0.0.0.0:${PORT}.`);
});

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });

//   Role.create({
//     id: 2,
//     name: "moderator"
//   });

//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }