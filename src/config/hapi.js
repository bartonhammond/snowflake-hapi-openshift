var Hapi = require('hapi');
var JwtAuth = require('../auth/jwt-strategy');
var Plugins = require('./plugins');
var Routes = require('./routes');

var internals = {};

internals.server = new Hapi.Server();

internals.server.connection({
  port: process.env.OPENSHIFT_NODEJS_PORT   ||
    process.env.OPENSHIFT_INTERNAL_PORT || 8080,
  
  address: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.OPENSHIFT_INTERNAL_IP || '127.0.0.1'
});
// register plugins
internals.server.register(Plugins.get(), function (err) {
  if (err) {
    console.error(err);
  }
});

// configure jwt strategy
JwtAuth.setStrategy(internals.server);

// set routes
Routes.init(internals.server);

module.exports = internals.server;
