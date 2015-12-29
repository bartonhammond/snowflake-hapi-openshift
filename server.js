'use strict';
/**
 *  # snowflake
 *  Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
 */

/**
 *  Hapi will be the NodeJS server.
 *  I figure if WalMart, the largest retailer in the world, uses it,
 *  it will work for me.  
 *
 * From the command line, run ```npm start``` 
 *
 *  Hapi is configured in this import
 */
var HapiServer = require('./src/config/hapi');

/**
* The mongodb will be used to store all the users
*/
require('./src/database/mongodb');

/**
 * When hapi starts up, some info is displayed
 */
HapiServer.start(function () {
  console.log('Server is running: ' + HapiServer.info.uri);
});

