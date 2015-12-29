'use strict';

var nodemailer = require("nodemailer"),
    Config = require('../config');


var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Config.email.username,
    pass: Config.email.password
  }
});

function getUrl( ) {
  var url = '';
  if (process.env.OPENSHIFT_APP_DNS) {
    url = 'https://' + process.env.OPENSHIFT_APP_DNS;
  } else {
    url =   'http://127.0.0.1:8080';
  }
  return url;
}
exports.sendMailVerificationLink = function(user,token) {
  var url = getUrl();
  var from = Config.email.accountName;
  var mailbody = "<p>Thanks for Registering on"
        + " "
        + Config.email.accountName
        +" </p><p>Please verify your email by clicking on the"
        + " verification link below.<br/><a href='"
        + url
        + "/account/verifyEmail/"
        +token
        + "'>Verification Link</a></p>";
  mail(from, user.email , "Account Verification", mailbody);
};

exports.sendMailResetPassword = function(user, token) {

  var url = getUrl();
  var from = Config.email.accountName;
  var mailbody = "<p>A reset password action has been requested from"
        + " "
        + Config.email.accountName
        +" </p><p>Please click on the "
        + " reset password link below.<br/>"
        + " The link is only available for 15 minutes.<br/>"
        + "<a href='"
        + url
        + "/account/resetPassword/"
        +token
        + "'>Reset Password Link</a></p>";
  mail(from, user.email , "Reset Password", mailbody);
};

function mail(from, email, subject, mailbody){
  var mailOptions = {
    from: from, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: mailbody  // html body
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.error(error);
    }
  });
}
