module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    fname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pfp: {
      type: Sequelize.STRING,
      defaultValue: '/upload/default/pfp.jpg'

    },
    coverPhoto: {
      type: Sequelize.STRING,
      defaultValue: '/upload/default/cover.jpg'
    },
    onlineStatus: {
      type: Sequelize.STRING,
      defaultValue: "online"
    },
    job: {
      type: Sequelize.STRING,
      defaultValue: "TV Model"
    }

  });

  return User;
};
