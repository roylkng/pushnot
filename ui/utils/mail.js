'use strict';
/*jslint node: true */

// Util functions related to mailers and related functions.

var nodemailer  = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var smtpPool = require("nodemailer-smtp-pool");
var sesTransport = require('nodemailer-ses-transport');

var MailUtils = function() {

  // Default sendGrid account
  this.getDefaultSendGridMailer = function() {
    return nodemailer.createTransport(sgTransport({
      auth: {
        api_user: 'thoughtfabrics',
        api_key: 'rang!ru123'
      },
    }));
  };

  this.getBackupSendGridMailer = function() {
    return nodemailer.createTransport(sgTransport({
      auth: {
        api_user: 'jagmal',
        api_key: 'Rang!ru123'
      },
    }));
  };

  this.getMandrillMailer = function() {
    return nodemailer.createTransport(smtpPool({
      host: 'smtp.mandrillapp.com',
      port: 587,
      auth: {
        user: 'admin@thoughtfabrics.com',
        pass: 'k1f4g5qXlJGLnkrgMe1LpQ'
      },
      maxConnections: 5,
      maxMessages: 10,
      socketTimeout : 60 * 1000 // 1 min
    }));
  };

  this.getSesMailer = function() {
    return nodemailer.createTransport(sesTransport({
      region: 'eu-west-1',
      accessKeyId: "AKIAJKMNQVWVGZZ7MQOA",
      secretAccessKey: "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",
      rateLimit: 10 // We have a rate limit of 14 emails per second.
    }));
  };

};

module.exports = new MailUtils();
