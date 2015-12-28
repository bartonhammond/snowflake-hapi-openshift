var Mongoose = require('mongoose');
var Config = require('../config');

var connection_string = Config.mongodb.ip
      + ':'
      +  Config.mongodb.port
      + '/'
      + Config.mongodb.app;


if(process.env.OPENSHIFT_MONGODB_DB_HOST){
  connection_string =
    process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}
Mongoose.connect(connection_string);
