// utils/email.js

const nodemailer = require('nodemailer');


/**
 * Function for sending an email using the nodemailer library and SMTP
 * configuration.
 */
const sendEmail = async options => {

  // 1) Create a transporter with SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       // Email host (e.g., SMTP server)
    port: process.env.EMAIL_PORT,       // Email port (e.g., 587 for TLS)
    auth: {
      user: process.env.EMAIL_USERNAME, // Email username (sender)
      pass: process.env.EMAIL_PASSWORD  // Email password (sender's password)
    }
  });

  // 2) Define the email options
  const mailOptions = {
   from: 'Elyahu Anavi <hello@ely.io>',   // Sender's name and email address
    to: options.email,                    // Recipient's email address
    subject: options.subject,             // Email subject
    text: options.message                 // Plain text message content (can be HTML as well)
    // html:                              // Optional HTML content for the email
  };

  // 3) Actually send the email using the configured transporter
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
