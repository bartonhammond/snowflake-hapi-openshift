var Hapi = require('hapi'),
    JwtAuth = require('../auth/jwt-strategy'),
    Hoek = require('hoek'),
    Plugins = require('./plugins'),
    Routes = require('./routes'),
    Views = require('./views');

var internals = {};

internals.server = new Hapi.Server();

internals.server.connection({
  port: process.env.OPENSHIFT_NODEJS_PORT   ||
    process.env.OPENSHIFT_INTERNAL_PORT || 8080,
  
  address: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.OPENSHIFT_INTERNAL_IP || '127.0.0.1'
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
