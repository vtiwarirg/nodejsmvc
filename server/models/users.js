'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Welcome2019";
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
      underscored: true,
      indexes: [{ unique: true, fields: ['email'] }],
      hooks: {
        beforeCreate: (users) => {
          if (users.hash) {
            users.salt = crypto.randomBytes(16).toString('hex');
            users.hash = crypto.pbkdf2Sync(users.hash, users.salt, 1000, 64, 'sha512').toString('hex');
          }
          return users;
        }
      }
    });

  users.associate = function (models) {
    // associations can be defined here
  };

  users.prototype.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };

  users.prototype.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
      id: this.id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, SECRET_KEY);
  };

  return users;
};