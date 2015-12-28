'use strict';

var GeneralHandlers = require('./handlers');
var internals = {};

internals.endpoints = [
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
