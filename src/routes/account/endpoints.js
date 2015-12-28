var Joi = require('joi');
var AccountHandlers = require('./handlers');

var internals = {};

internals.endpoints = [
  {
    method: 'POST',
    path: '/account/register',
    handler: AccountHandlers.registerUser,
    config: {
      validate: {
	payload: {
	  username: Joi.string().alphanum().min(6).max(12).required(),
	  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
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
    method: 'GET',
    path: '/account/verifyEmail/{token}',
    handler: AccountHandlers.verifyEmail
  }
];

module.exports = internals;
