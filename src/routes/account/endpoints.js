/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
'use strict';
/**
 * ## Imports
 *
 */
//Handle the endpoints
var AccountHandlers = require('./handlers'),
    //The static configurations
    CONFIG = require('../../config'),
    //Joi is Hapi's validation library
    Joi = require('joi');

var internals = {};
/**
 * ## Set the method, path, and handler
 *
 * Note the account/logout requires authentication
 *
 * Note the validation of the account/register parameters
 *
 * Note account/register has same Regex expression as Snowflake client
 */
internals.endpoints = [
  {
    method: 'POST',
    path: '/account/register',
    handler: AccountHandlers.registerUser,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'Register user',
      notes: 'The user registration generates an email for verification',
      validate: {
	payload: {
          //username required with same regex as client
	  username: Joi.string().regex(CONFIG.validation.username).required(),
          //password required with same regex as client          
	  password: Joi.string().regex(CONFIG.validation.password).required(),
          //email required
	  email: Joi.string().email().required()
	}
      }
    }
  },
  {
    method: 'POST',
    path: '/account/login',
    handler: AccountHandlers.loginUser,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'A user can login',
      notes: 'The user login will return a sessionToken',
      validate: {
	payload: {
          //username required with same regex as client          
	  username: Joi.string().regex(CONFIG.validation.username).required(),
          //password required with same regex as client
	  password: Joi.string().regex(CONFIG.validation.password).required()
	}
      }
    }
  },
  {
    method: 'POST',
    path: '/account/logout',
    handler: AccountHandlers.logoutUser,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'A user can logout',
      notes: 'A user may be already be logged in',
      //authorization optional
      auth: 'token',
      validate: {
        headers: Joi.object({
          'Authorization': Joi.string()
        }).unknown()      
      }
    }
  },
  {
    method: 'GET',
    path: '/account/verifyEmail/{token}',
    handler: AccountHandlers.verifyEmail,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'Users email is verified',
      notes: 'User clicks link in email sent during registration',
      validate: {
        params: {
          token: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/account/resetPasswordRequest',
    handler: AccountHandlers.resetPasswordRequest,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'User requests to reset password',
      notes: 'Email is sent to email address provided',
      validate: {
	payload: {
          //email required
	  email: Joi.string().email().required()          
	}
      }      

    }
  },
  {
    //send html w/ password reset form    
    method: 'GET',
    path: '/account/resetPassword/{token}',
    handler: AccountHandlers.displayResetPassword
  },
  {
    method: 'POST',
    path: '/account/resetPassword',
    handler: AccountHandlers.resetPassword,
    config: {
      // Include this API in swagger documentation
      tags: ['api'],
      description: 'User posts new password',
      notes: 'Password form posts new password',
      validate: {
	payload: {
          //password required with same regex as client          
	  password: Joi.string().regex(CONFIG.validation.password).required(),
          //email required
	  token: Joi.string().required()          
	}
      }      

    }    
  },
  {
    method: 'GET',
    path: '/account/profile/me',
    handler: AccountHandlers.getMyProfile,
    config: {
      auth: 'token',
      tags: ['api'],
      description: 'Get the current users profile',
      notes: 'The user has username, email and emailVerified',      
      validate: {
        headers: Joi.object({
          'Authorization': Joi.string()
        }).unknown()      
      }      
    }
  },
  {
    method: 'POST',
    path: '/account/profile/{_id}',
    handler: AccountHandlers.updateProfile,
    config: {
      auth: 'token',
      tags: ['api'],
      description: 'Update user profile',
      notes: 'User is able to change their username and email',
      validate: {
        payload: {
          //email required          
	  email: Joi.string().email().required(),
          //username required          
	  username: Joi.string().regex(CONFIG.validation.username).required()
	},
        params: {
          _id: Joi.string().required()
        },        
        headers: Joi.object({
          'Authorization': Joi.string()
        }).unknown()      
      }      
    }
  },

];


module.exports = internals;
