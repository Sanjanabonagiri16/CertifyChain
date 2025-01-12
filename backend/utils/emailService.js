const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // For testing only - remove in production
  }
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Email templates
const emailTemplates = {
  verifyEmail: (token) => ({
    subject: 'Verify Your Email - CertifyChain',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Welcome to CertifyChain!</h1>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3003/verify-email/${token}" 
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #7f8c8d;">http://localhost:3003/verify-email/${token}</p>
        <p>This link will expire in 24 hours.</p>
        <p style="color: #95a5a6; font-size: 0.9em;">If you did not create an account, please ignore this email.</p>
      </div>
    `
  }),
  resetPassword: (token) => ({
    subject: 'Reset Your Password - CertifyChain',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3003/reset-password/${token}"
             style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #7f8c8d;">http://localhost:3003/reset-password/${token}</p>
        <p>This link will expire in 1 hour.</p>
        <p style="color: #95a5a6; font-size: 0.9em;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, type, token) => {
  try {
    console.log(`Attempting to send ${type} email to: ${to}`);
    const template = emailTemplates[type](token);
    
    const mailOptions = {
      from: `"CertifyChain" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      type: type
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', {
      error: error.message,
      to: to,
      type: type
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = { sendEmail }; 