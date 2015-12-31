/**
 * # User.js
 *
 * The user document for Mongoose
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
//Mongoose - the ORM
var Mongoose = require('mongoose'),
    //The document structure definition
    Schema = Mongoose.Schema;

//Same fields as Parse.com 
var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  emailVerified: Boolean  
});

/**
 * ## findUserByIdAndUserName
 *
 * @param id - user _id from Mongodb
 * @param username - username field from Mongodb
 * @param callback - resolve the action
 *
 */
UserSchema.statics.findUserByIdAndUserName = function(id, username, callback) {
  this.findOne({
    username: username,
    _id: id
  }, callback);
};
/**
 * ## findUserByEmail
 *
 * @param email - the user document email field from Mongodb
 * @param callback - resolve the action
 *
 */
UserSchema.statics.findUserByEmail = function(email, callback) {
  this.findOne({
    email: email
  }, callback);
};

/**
 * ## Mongoose model for User 
 *
 * @param UserSchema - the document structure definition
 *
 */
var user = Mongoose.model('User', UserSchema);

module.exports = user;
