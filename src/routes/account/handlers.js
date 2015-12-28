'use strict';

var Boom = require('boom'),
    Config = require('../../config'),    
    Crypto = require('../../lib/Crypto'),
    JasonWebToken = require('jsonwebtoken'),    
    JwtAuth = require('../../auth/jwt-strategy'),
    Mailer = require('../../lib/Mailer'),
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
      
      Mailer.sentMailVerificationLink(user,
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

module.exports = internals;
