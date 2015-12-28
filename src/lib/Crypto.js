'use strict';

var Config = require('../config'),
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

var privateKey = Config.crypto.privateKey;

// create reusable transport method (opens pool of SMTP connections)

exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
    return encrypt(password);
};

// method to decrypt data(password) 
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

