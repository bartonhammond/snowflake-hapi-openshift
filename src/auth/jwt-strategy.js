var User = require('../database/models/User.js');
var Jwt = require('jsonwebtoken');
var Config = require('../config');

var internals = {};

internals.privateKey = Config.crypto.privateKey;

// function to validate token
internals.validate = function (request, decodedToken, callback) {
  var credentials = {};
  
  User.findOne({ username: decodedToken.username, email: decodedToken.email }, function (err, user) {

    if (err) {
      return callback(err, false, credentials);		
    } else {
      credentials = user;

      callback(err, true, credentials);
    }
  });
};

// create token
internals.createToken = function (obj) {
  return Jwt.sign(obj, internals.privateKey);
};

// set jwt auth strategy
internals.setJwtStrategy = function (server) {
  server.auth.strategy('token', 'jwt', {
    key: internals.privateKey,
    validateFunc: internals.validate
  });
};

module.exports = {
  setStrategy: internals.setJwtStrategy,
  createToken: internals.createToken
};
