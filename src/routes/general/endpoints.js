/**
 * # general/endpoints.js
 *
 * This supports a status and env request
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
var GeneralHandlers = require('./handlers'),
    internals = {};
/**
 * ## endpoints
 *
 * both are simple gets
 */
internals.endpoints = [
  {
    method: 'GET',
    path: '/',
    handler: GeneralHandlers.index
  },  
  {
    method: 'GET',
    path: '/status',
    handler: GeneralHandlers.status
  },
  {
    method: 'GET',
    path: '/env', 
    handler: GeneralHandlers.env
  }

];

module.exports = internals;
