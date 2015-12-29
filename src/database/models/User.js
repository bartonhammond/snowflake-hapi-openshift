var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  emailVerified: Boolean  
});

UserSchema.statics.findUserByIdAndUserName = function(id, username, callback) {
  this.findOne({
    username: username,
    _id: id
  }, callback);
};

UserSchema.statics.findUserByEmail = function(email, callback) {
  this.findOne({
    email: email
  }, callback);
};


var user = Mongoose.model('User', UserSchema);

module.exports = user;
