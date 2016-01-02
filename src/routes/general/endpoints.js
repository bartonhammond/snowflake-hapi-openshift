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
    handler: GeneralHandlers.index,
    config: {
      description: 'Get the default/home template.',
      notes: 'Renders the /docs/home.md file as HTML.',
      tags: ['api']
    }    
  },  
  {
    method: 'GET',
    path: '/status',
    handler: GeneralHandlers.status,
    config: {
      description: 'Show the status.',
      notes: 'renders json if server is running',
      tags: ['api']
    }        
  },
  {
    method: 'GET',
    path: '/env', 
    handler: GeneralHandlers.env,
     config: {
      description: 'Show the environment variables.',
      notes: 'Renders the variables known to the server',
      tags: ['api']
    } 
  }

];

module.exports = internals;
