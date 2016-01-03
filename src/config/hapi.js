/**
 * # Hapi.js
 *
 * This is a configuration for Hapi
 * 
 * Note that Hapi is configuration over coding 
 * 
 * There's no coding here!!
 */
'use strict';

/**
* ## Imports
*
*/
var Hapi = require('hapi'),
    // the authentication strategy
    JwtAuth = require('../auth/jwt-strategy'),
    // kind of like underscore, but specific to Hapi
    Hoek = require('hoek'),
    // some additional services
    Plugins = require('./plugins'),
    // the routes we'll support
    Routes = require('./routes'),
    // the view, mainly for reset password
    Views = require('./views');

var internals = {};

//The real Hapi server! 
internals.server = new Hapi.Server();

//Setup the connection for the environment
internals.server.connection({
  port: process.env.OPENSHIFT_NODEJS_PORT || 5000,
  address: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
});

// register plugins
internals.server.register(Plugins.get(), (err) => {
  Hoek.assert(!err,err);
});
// configure jwt strategy
JwtAuth.setStrategy(internals.server);

//setup views for resetpassword
Views.init(internals.server);

// set routes
Routes.init(internals.server);

module.exports = internals.server;
