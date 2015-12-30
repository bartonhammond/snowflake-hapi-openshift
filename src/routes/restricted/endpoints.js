/**
 * # This is our one restricted endpoint (beside logout)
 * 
 */
'use strict';

/**
* ## Imports
*
*/
var RestrictedHandlers = require('./handlers');

var internals = {};
/**
* ## endpoints
*
* note the config which means authentication is required to access
* this end point
*
*/
internals.endpoints = [
  {
    method: 'GET',
    path: '/restricted',
    handler: RestrictedHandlers.restrictedArea,
    config: {
      auth: 'token'
    }
  }
];

module.exports = internals;
