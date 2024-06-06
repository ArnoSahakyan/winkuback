require('dotenv').config()

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.post = require("../models/post.model.js")(sequelize, Sequelize);
db.comment = require("../models/comment.model.js")(sequelize, Sequelize);
db.friend = require("../models/friend.model.js")(sequelize, Sequelize);
db.friendRequest = require("../models/friendRequest.model.js")(sequelize, Sequelize);

// Comment Relations to Post, User and Comment itself
db.comment.belongsTo(db.post, { foreignKey: 'postId' });
db.post.hasMany(db.comment, { foreignKey: 'postId' })

db.comment.belongsTo(db.user, { foreignKey: 'userId' });
db.user.hasMany(db.comment, { foreignKey: 'userId' })

db.comment.belongsTo(db.comment, { foreignKey: 'parentId', as: 'parent' });
db.comment.hasMany(db.comment, { foreignKey: 'parentId', as: 'replies' });

// Post to User Relations
db.user.hasMany(db.post, { foreignKey: 'userId' });
db.post.belongsTo(db.user, { foreignKey: 'userId' });

// Friend to User Relations
db.friend.belongsTo(db.user, { as: 'user', foreignKey: 'userId' });
db.friend.belongsTo(db.user, { as: 'friend', foreignKey: 'friendId' });

// FriendRequest to User Relations
db.friendRequest.belongsTo(db.user, { as: 'sender', foreignKey: 'senderId' });
db.friendRequest.belongsTo(db.user, { as: 'receiver', foreignKey: 'receiverId' });

// User to Roles Relations
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
