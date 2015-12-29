'use strict';

var Hoek = require('hoek'),
    Path = require('path'),
    internals = {};

internals.init = function (server) {

  server.register(require('vision'), (err) => {

    Hoek.assert(!err,err);
    
    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: Path.join(__dirname, '../views')      
    });

    // Static Assets
  });
  
  server.register(require('inert'), (err) => {
    
    Hoek.assert(!err,err);

    server.route({
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../assets')          
        }
      }
    });
  });
  
};

module.exports = internals;
