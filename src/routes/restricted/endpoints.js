var RestrictedHandlers = require('./handlers');

var internals = {};

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
