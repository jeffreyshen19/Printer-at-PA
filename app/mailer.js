/*jslint node: true */
/*jslint esversion: 6 */

'use strict';
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theprinteratpa@gmail.com',
    pass: process.env.GMAIL_PASS
  }
});

module.exports = {
  send: function(email, time, date){
    let mailOptions = {
      from: '"The Printer" <theprinteratpa@gmail.com>', // sender address
      to: 'laaron@andover.edu', // list of receivers
      subject: 'New Registration', // Subject line
      html: "<b>Email:</b> " + email + "<br><b>Time:</b> " + time + "<br><b>Day:</b> " + date // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
  }
};
