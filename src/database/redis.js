var Redis = require('redis'),
    Config = require('../config'),
    redisClient = {};

var connection_string = Config.redis;

if(process.env.OPENSHIFT_REDIS_HOST){
  connection_string.host = process.env.OPENSHIFT_REDIS_HOST;
  connection_string.port = process.env.OPENSHIFT_REDIS_PORT;
  redisClient = Redis.createClient(connection_string);
  redisClient.auth( process.env.REDIS_PASSWORD);
} else {
  redisClient = Redis.createClient(connection_string);    
}

module.exports = redisClient;

