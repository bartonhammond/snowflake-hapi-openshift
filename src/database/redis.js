/**
 * # redis.js
 *
 * This is the configuration for Redis 
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
var Redis = require('redis'),
    Config = require('../config'),
    redisClient = {};
/**
 * ## The connect string for the dev environment
 *
 */
var connection_string = Config.redis;
/**
 *
 * ## The connect string for the OpenShift env
 *
 */
if(process.env.OPENSHIFT_REDIS_DB_HOST){
  //The redis env variables on openshift
  connection_string.host = process.env.OPENSHIFT_REDIS_DB_HOST;
  connection_string.port = process.env.OPENSHIFT_REDIS_DB_PORT;

  //connect to Redis
  redisClient = Redis.createClient(connection_string);

  //have to authenticate
  redisClient.auth( process.env.OPENSHIFT_REDIS_DB_PASSWORD);
} else {
  
  //running locally - make sure you've started redis server
  redisClient = Redis.createClient(connection_string);    
}

module.exports = redisClient;

