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
    CONFIG = require('../../config'),
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
    // helper library
    _ = require('underscore'),
    // our user in mongodb
    User = require('../../database/models/User');

var internals = {};
/**
 * ## registerUser
 *
 * Encrypt the password and store the user
 */
internals.registerUser = function (req, reply) {
  console.log('registerUser',req.payload);
  req.payload.password = Crypto.encrypt(req.payload.password);
  req.payload.emailVerified = false;
  var user = new User(req.payload);
  
  //save the user w/ the encrypted password
  user.save(function (err, user) {
    if (err) {
      reply(Boom.conflict(err));
    } else {
      var tokenData = {
        username: user.username,
        id: user._id
      };
      // send an email verification with a JWT token
      Mailer.sendMailVerificationLink(user,
                                      JasonWebToken.sign(tokenData,
                                                         CONFIG.crypto.privateKey));

      /** user: 
       register { _id: 56844c798d4dce65e2b45b6e,
       emailVerified: false,
       password: 'd5be02df44dafbbcfb',
       email: 'barton@acclivyx.com',
       username: 'barton',
       __v: 0 }
       */
      //Let the user know they are registered
      //Note that the token is created only with the user._id since
      //the user can change their username & email
      //If the token embeds either of those fields, it becomes
      //an invalid token once the user changes those fields
      reply({
	statusCode: 201,
        objectId: user._id,
	sessionToken: JwtAuth.createToken({ id: user._id})
      });
    }
  });
};
/**
 * ## loginUser
 *
 * Find the user by username, verify the password matches and return 
 * the user 
 *
 */
internals.loginUser = function (req, reply) {
  User.findOne({ username: req.payload.username }, function (err, user) {
    
    if (err) {
      reply(Boom.unauthorized('Authentication failed'));
    }

    if (_.isNull(user)) {
      reply(Boom.unauthorized('Authentication failed'));
    } else {
      if (Crypto.decrypt(user.password) !=
        req.payload.password) {
        reply(Boom.unauthorized('Authentication failed'));
      } else {
        reply({
          email: user.email,
          objectId: user._id,
          username: user.username,
          sessionToken: JwtAuth.createToken({
            id: user._id
          })
        });//reply
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
  reply({});
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
  JasonWebToken.verify(req.params.token, CONFIG.crypto.privateKey, function(err, decoded) {
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
      
      //The token will have id & username encrypted      
      Mailer.sendMailResetPassword(
        user,
        JasonWebToken.sign(tokenData,
                           CONFIG.crypto.privateKey));
      
      reply({});
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
  reply.view('resetpassword.html', {token: req.params.token});
};

/**
 * Update password of user
 */
/**
 * ## Imports
 *
 */
internals.resetPassword = function (req, reply) {
  
  JasonWebToken.verify(req.payload.token, CONFIG.crypto.privateKey, function(err, decoded) {
    
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
/**
 * ## getMyProfile
 * 
 * We only get here through authentication
 *
 * note: the user is available from the credentials!
 */
internals.getMyProfile = function (req, reply) {
  reply({
    objectId: req.auth.credentials._id,
    username: req.auth.credentials.username,
    email: req.auth.credentials.email,
    emailVerified: req.auth.credentials.emailVerified,
    sessionToken: req.headers.authorization.split(' ')[1]
  });
};
/**
 * ## getMyProfile
 * 
 * We only get here through authentication
 *
 * note: the user is available from the credentials!
 */
internals.updateProfile = function (req, reply) {
  User.findById(req.params._id, function(err, user) {
    if (err) {
      return reply(Boom.badImplementation(err));
    }
    

    //Provide no indication if user exists
    if (user) {
      user.username = req.payload.username;
      
      //If user changed email, it needs to be verified
      if (user.email !== req.payload.email) {
        user.emailVerified = false;
      }
      user.email = req.payload.email;

      
      user.save(function(err, updatedUser) {
        if (err) {
          return reply(Boom.conflict("User couldn't be saved."));
        }
        
        //Send verification email if needed
        if (!updatedUser.emailVerified) {
          var tokenData = {
            username: user.username,
            id: user._id
          };
          // send an email verification with a JWT token
          Mailer.sendMailVerificationLink(user,
                                          JasonWebToken.sign(tokenData,
                                                             CONFIG.crypto.privateKey));
        }
        reply({});
      });

    }
  });  
};

module.exports = internals;
