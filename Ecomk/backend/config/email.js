const nodemailer = require('nodemailer');

// Configure transporter for local SMTP (Papercut)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'normanrivera005@gmail.com',
        pass: 'jvqx ylky xpki kgkl',
      }
});

module.exports = transporter;
