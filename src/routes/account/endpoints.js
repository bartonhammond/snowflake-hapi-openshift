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
      validate: {
	payload: {
	  username: Joi.string().regex(CONFIG.validation.username).required(),
	  password: Joi.string().regex(CONFIG.validation.password).required(),
	  email: Joi.string().email().required()
	}
      }
    }
  },
  {
    method: 'POST',
    path: '/account/login',
    handler: AccountHandlers.loginUser
  },
  {
    method: 'POST',
    path: '/account/logout',
    handler: AccountHandlers.logoutUser,
    config: {
      auth: 'token'
    }
  },  
  {
    method: 'GET',
    path: '/account/verifyEmail/{token}',
    handler: AccountHandlers.verifyEmail
  },
  {
    method: 'POST',
    path: '/account/resetPasswordRequest',
    handler: AccountHandlers.resetPasswordRequest
  },
  {
    method: 'GET',
    path: '/account/resetPassword/{token}',
    handler: AccountHandlers.displayResetPassword
  },
  {
    method: 'POST',
    path: '/account/resetPassword',
    handler: AccountHandlers.resetPassword
  },
  {
    method: 'GET',
    path: '/account/profile/me',
    handler: AccountHandlers.getMyProfile,
    config: {
      auth: 'token'
    }
  },
  {
    method: 'POST',
    path: '/account/profile/{_id}',
    handler: AccountHandlers.updateProfile,
    config: {
      auth: 'token'
    }
  },

];


module.exports = internals;
