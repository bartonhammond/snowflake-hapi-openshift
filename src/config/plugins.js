/**
 * # plugins.js
 *
 * Plugins are like middleware, they get used 'automagically'
 *
 */
'use strict';


var internals = {};

/**
* ## plugins
*
* when a route is config'd with auth, the hapi-auth-jwt will be invoked
*
* the good module prints out messages
*/
internals.plugins = function () {
  return [
    {
      register: require('hapi-auth-jwt'),
      options: {}
    },
    {

      register: require('good'),
      options: {
        opsInterval: 1000,
        reporters: [{
          reporter: require('good-console'),
          events: { log: '*', response: '*', request: '*' }
        }]
      }
    }
  ];
};

module.exports.get = internals.plugins;
