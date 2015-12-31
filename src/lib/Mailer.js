/**
 * # Mailer.js
 *
 * Create email and send content
 * 
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
var Config = require('../config'),
    // kind of like underscore, but specific to Hapi
    Hoek = require('hoek'),
    // the email library
    nodemailer = require("nodemailer");

/**
 * ## transporter
 * configure the email provider
 */
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: Config.email.username,
    pass: Config.email.password
  }
});
/**
 * ## getUrl 
 * Local or OpenShift
 *
 */
function getUrl( ) {
  var url = '';
  if (process.env.OPENSHIFT_APP_DNS) {
    url = 'https://' + process.env.OPENSHIFT_APP_DNS;
  } else {
    url =   'http://127.0.0.1:8080';
  }
  return url;
}
/**
 * ## sendMailVerificationLink
 *
 * send email for verification of the account's email address
 *
 */
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
/**
 * ## sendMailResetPassword
 *
 * Set email to user so they can reset their password
 *
 */
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
/**
 * ## mail
 *
 * The main function, sends the email 
 *
 * @param from who email is from
 * @param email who email is sent to
 * @param subject the subject of the email
 * @param mailbody the body of the email 
 */
function mail(from, email, subject, mailbody){
  var mailOptions = {
    from: from, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: mailbody  // html body
  };
  //Send email
  transporter.sendMail(mailOptions, function(error) {
    Hoek.assert(!error,error);
  });
}
