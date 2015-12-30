/**
 * # account/handlers.js
 *
 * This handles all the account actions
 *
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
//Boom is an abstraction over http error codes
var Boom = require('boom'),
    // our configuration
    Config = require('../../config'),
    // our encrpyt and decrypt
    Crypto = require('../../lib/Crypto'),
    // support for token signing and verification
    JasonWebToken = require('jsonwebtoken'),
    // the Hapi strategy for jwt
    JwtAuth = require('../../auth/jwt-strategy'),
    // how we email 
    Mailer = require('../../lib/Mailer'),
    // time/date functions
    Moment = require('moment'),
    // the client for redis
    redisClient = require('../../database/redis'),
    // our user in mongodb
    User = require('../../database/models/User');

var internals = {};
/**
 * ## registerUser
 *
 * Encrypt the password and store the user
 */
internals.registerUser = function (req, reply) {

  req.payload.password = Crypto.encrypt(req.payload.password);
  req.payload.emailVerified = false;
  var user = new User(req.payload);
  
  //save the user w/ the encrypted password
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
      // send an email verification with a JWT token
      Mailer.sendMailVerificationLink(user,
                                      JasonWebToken.sign(tokenData,
                                                         Config.crypto.privateKey));
      //Let the user know they are registered
      reply({
	statusCode: 201,
	message: "User registered.",
	token: JwtAuth.createToken({ username: user.username, email: user.email })
      });
    }
  });
};
/**
 * ## loginUser
 *
 * Find the user by username, verify the password matches and return a
 * message with a token for subsequent usage
 *
 */
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
 * ## logoutUser
 *
 * Create a token blacklist with Redis
 * see: https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/
 *
 */
internals.logoutUser = function(req, reply) {
  var headers = req.headers.authorization.split(' ');
  redisClient.set(headers[1], new Date());
  reply({success: true, message: 'Logged out'});
};
/**
 * ## verifyEmail
 *
 * If the token is verified, find the user using the decoded info
 * from the token.
 *
 * Set the emailVeried to true if user is found
 *
 */
internals.verifyEmail = function (req, reply) {
  JasonWebToken.verify(req.params.token, Config.crypto.privateKey, function(err, decoded) {
    if(decoded === undefined) {
      return reply(Boom.forbidden("invalid verification link"));
    }
    
    User.findUserByIdAndUserName(decoded.id, decoded.username, function(err, user){
      //oops, something wrong
      if (err) {
        return reply(Boom.badImplementation(err));
      }
      
      //No user found for this link
      if (user === null) {
        return reply(Boom.forbidden("invalid verification link"));
      }

      //not sure if this is really an error...
      if (user.isVerified === true) {
        return reply(Boom.forbidden("account is already verified"));
      }

      //Everything is fine, update the users flag for emailVerified
      user.emailVerified = true;
      user.save(function(err){
        if (err) {
          return reply(Boom.badImplementation(err));
        }
        return reply("account sucessfully verified");

      });
    })
    
  });
};
/**
 * ## resetPasswordRequest
 *
 */
internals.resetPasswordRequest = function (req, reply) {
  User.findUserByEmail(req.payload.email, function(err, user) {
    if (err) {
      return reply(Boom.badImplementation(err));
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
/**
 * ## Imports
 *
 */
internals.displayResetPassword = function (req, reply) {
  reply.view('resetpassword', {token: req.params.token});
};

/**
 * Update password of user
 */
/**
 * ## Imports
 *
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
