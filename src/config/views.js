/**
 * # views.js
 *
 * Snowflake has only one view, reset password
 *
 * Using the module 'vision, establish the renderering engine,
 * in this case, handlebars, and where the views are located
 *
 * Since this reset password view needs a javascript file,
 * the location of this 'asset' is set.
 *
 */
'use strict';

/**
* ## Imports
*
*/
var Hoek = require('hoek'),
    Path = require('path'),
    internals = {};

/**
* ## init
*
*/
internals.init = function (server) {

  /**
   * ### vision
   *
   * this establishes where the html is located
   * and the engine to parse it
   */
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
  /**
   * ### inert
   *
   * this says that any request for /assest/* will 
   * be served from the ../assests dir
   *
   * The resetpassword.js is located in ../assests
   *
   */
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
