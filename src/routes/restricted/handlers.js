/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
'use strict';

var internals = {};
/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */
internals.restrictedArea = function (req, reply) {
  reply({ message: req.auth.credentials.username + ', welcome to restricted area!' });
};

module.exports = internals;
