var  Config = require('../config'),
    internals = {},
    Jwt = require('jsonwebtoken'),
    redisClient = require('../database/redis'),
    User = require('../database/models/User.js');


internals.privateKey = Config.crypto.privateKey;

/**
 *  When a route is configured w/ 'auth', this validate function is
 * invoked
 * 
 * If the token wasn't invalidated w/ logout, then validate
* its for a user
 */
internals.validate = function (request, decodedToken, callback) {
  
  var credentials = {};
  
  var headers = request.headers.authorization.split(' ');
  if (headers.length === 2) {
    redisClient.get(headers[1], function (err, reply) {
      if (err) {
        console.log(err);
        return callback(err, false, credentials);		        
      }
      
      if (reply) {
        return callback({message: 'invalid auth token'}, false, credentials);		        
      }

      User.findOne({ username: decodedToken.username, email: decodedToken.email }, function (err, user) {

        if (err) {
          return callback(err, false, credentials);		
        } else {
          credentials = user;

          return callback(err, true, credentials);
        }
      });
    });
  }

  

};

// create token
internals.createToken = function (obj) {
  return Jwt.sign(obj, internals.privateKey, {jwtid: 'jwtid'});
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
