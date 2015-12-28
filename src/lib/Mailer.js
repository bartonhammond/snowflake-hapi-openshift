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

exports.sentMailVerificationLink = function(user,token) {
  var url = '';
  if (process.env.OPENSHIFT_APP_DNS) {
    url = 'https://' + process.env.OPENSHIFT_APP_DNS;
  } else {
    url =   'http://127.0.0.1:8080';
  }

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

exports.sentMailForgotPassword = function(user) {
  var from = Config.email.accountName+" Team<" + Config.email.username + ">";
  var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>";
  mail(from, user.email , "Account password", mailbody);
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
