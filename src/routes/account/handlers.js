'use strict';

var Boom = require('boom'),
    Config = require('../../config'),    
    Crypto = require('../../lib/Crypto'),
    JasonWebToken = require('jsonwebtoken'),    
    JwtAuth = require('../../auth/jwt-strategy'),
    Mailer = require('../../lib/Mailer'),
    Moment = require('moment'),
    redisClient = require('../../database/redis'),
    User = require('../../database/models/User');

var internals = {};

internals.registerUser = function (req, reply) {

  req.payload.password = Crypto.encrypt(req.payload.password);
  req.payload.emailVerified = false;
  var user = new User(req.payload);

  user.save(function (err, user) {

    if (err) {
      reply({
	statusCode: 503,
	message: "User couldn't be saved."
      });
    } else {
      var tokenData = {
        username: user.username,
        id: user._id
      };
      
      Mailer.sendMailVerificationLink(user,
                                      JasonWebToken.sign(tokenData,
                                                         Config.crypto.privateKey));
      
      reply({
	statusCode: 201,
	message: "User registered.",
	token: JwtAuth.createToken({ username: user.username, email: user.email })
      });
    }
  });
};

internals.loginUser = function (req, reply) {

  var credentials = {};
  User.findOne({ username: req.payload.username }, function (err, user) {
    
    if (err) {
      reply({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      credentials = user;
      if (Crypto.decrypt(credentials.password) != req.payload.password) {
	reply({ success: false, message: 'Passwords does not match.' });
      } else {
	reply({ success: true, message: 'Authenticated.', token: JwtAuth.createToken({ username: credentials.username, email: credentials.email }) });
      }
    }
  });
};

/**
 *
 * Create a token blacklist with Redis
 * see: https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/
 *
 */
internals.logoutUser = function(req, reply) {
  console.log('logoutUser.req.head.auth', req.headers.authorization);
  var headers = req.headers.authorization.split(' ');
  redisClient.set(headers[1], new Date());
  reply({success: true, message: 'Logged out'});
};

internals.verifyEmail = function (req, reply) {
  console.log('verifyEmail: ' + req.params.token);
  JasonWebToken.verify(req.params.token, Config.crypto.privateKey, function(err, decoded) {
    console.log('verifyEmail.err',err);
    console.log('verifyEmail.decoded',decoded);
    if(decoded === undefined) {
      return reply(Boom.forbidden("invalid verification link"));
    }
    
    User.findUserByIdAndUserName(decoded.id, decoded.username, function(err, user){
      if (err) {
        console.error(err);
        return reply(Boom.badImplementation(err));
      }
      if (user === null) {
        return reply(Boom.forbidden("invalid"
                                    + " verification"
                                    + " link"));
      }
      
      if (user.isVerified === true) {
        return reply(Boom.forbidden("account is already verified"));
      }

      
      user.emailVerified = true;
      user.save(function(err){
        if (err) {
          console.error(err);
          return reply(Boom.badImplementation(err));
        }
        return reply("account sucessfully verified");

      });
    })
    
  });
};

internals.resetPasswordRequest = function (req, reply) {
  console.log('resetPasswordRequest.email: ' + req.payload.email);
  User.findUserByEmail(req.payload.email, function(err, user) {
    if (err) {
      console.log('resetPasswordRequest.err: ' + err);
    }
    //Provide no indication if user exists
    if (user) {
      var tokenData = {
        username: user.username,
        id: user._id
      };
      
      Mailer.sendMailResetPassword(user,
                                   JasonWebToken.sign(tokenData,
                                                      Config.crypto.privateKey));
      
      reply({
	statusCode: 201,
	message: "email delivered."
      });
    }
  });
};


/**
 * Display the resetPassword form
 */
internals.displayResetPassword = function (req, reply) {
  reply.view('resetpassword', {token: req.params.token});
};

/**
 * Update password of user
 */
internals.resetPassword = function (req, reply) {
  
  JasonWebToken.verify(req.payload.token, Config.crypto.privateKey, function(err, decoded) {
    
    if(decoded === undefined) {
      return reply(Boom.forbidden("invalid resetPassword link"));
    }
    
    //Must fit w/in time allocated
    var diff = Moment().diff(Moment(decoded.iat * 1000));
    if (diff > CONFIG.crypto.tokenExpires) {
      return reply(Boom.unauthorized('reset password allowed time has past'));
    }

    User.findUserByIdAndUserName(decoded.id, decoded.username, function(err, user){
      if (err) {
        return reply(Boom.badImplementation(err));
      }
      if (user === null) {
        return reply(Boom.forbidden("invalid resetPassword link"));
      }
      
      user.password = Crypto.encrypt(req.payload.password);
      user.save(function(err){
        if (err) {
          return reply(Boom.badImplementation(err));
        }
        
        return reply("account password updated");

      });
    })
  });

};

module.exports = internals;
