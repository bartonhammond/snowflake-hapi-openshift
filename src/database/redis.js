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
if(process.env.OPENSHIFT_REDIS_HOST){
  connection_string.host = process.env.OPENSHIFT_REDIS_HOST;
  connection_string.port = process.env.OPENSHIFT_REDIS_PORT;
  redisClient = Redis.createClient(connection_string);
  redisClient.auth( process.env.REDIS_PASSWORD);
} else {
  redisClient = Redis.createClient(connection_string);    
}

module.exports = redisClient;

