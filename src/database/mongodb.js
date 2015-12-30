/**
 * # mongodb.js
 *
 * All the user information will be documents in MongoDB
 *
 * This class sets up the connection depending on the environment
 *
 */
'use strict';

/**
* ## Imports
*
 */
//use mongoose as the ORM
var Mongoose = require('mongoose'),
    Config = require('../config');


/**
* ## Default the connection string to the development envionment
*
*/
var connection_string = Config.mongodb.ip
      + ':'
      +  Config.mongodb.port
      + '/'
      + Config.mongodb.app;

/**
* ## Set the connection string for the OpenShift environment 
* 
*/
if(process.env.OPENSHIFT_MONGODB_DB_HOST){
  connection_string =
    process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}
Mongoose.connect(connection_string);
