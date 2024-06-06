require('dotenv').config()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: '1hr',
    });
  return accessToken
}

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: "1d",
    });
  return refreshToken
}

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    fname: req.body.fname,
    username: req.body.username.toLowerCase(),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      const authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          fname: user.fname,
          username: user.username,
          email: user.email,
          pfp: user.pfp,
          coverPhoto: user.coverPhoto,
          job: user.job,
          onlineStatus: user.onlineStatus,
          accessToken,
          refreshToken,
          roles: authorities,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required!" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token!" });
    }

    const userId = decoded.id;

    User.findByPk(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found!" });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user);

        // Send the new access token in the response
        res.status(200).json({ accessToken: accessToken });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
};

exports.userInfo = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'fname', 'username', 'email', 'pfp', 'coverPhoto', 'onlineStatus', 'job']
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      id: user.id,
      fname: user.fname,
      username: user.username,
      email: user.email,
      pfp: user.pfp,
      coverPhoto: user.coverPhoto,
      onlineStatus: user.onlineStatus,
      job: user.job
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving user information",
      error: error.message
    });
  }
};