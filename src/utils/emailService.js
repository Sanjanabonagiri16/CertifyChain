// This is a mock email service. In production, you would use a real email service like SendGrid or AWS SES
export const sendCredentialEmail = (email, password) => {
  // In a real application, you would integrate with an email service here
  console.log('Sending credentials to:', email);
  console.log('Email content:', {
    subject: 'Your Certificate Management System Credentials',
    body: `
      Hello,
      
      Your account has been created in the Certificate Management System.
      
      Your credentials are:
      Email: ${email}
      Password: ${password}
      
      Please login at: ${window.location.origin}/user-login
      
      For security reasons, please change your password after your first login.
      
      Best regards,
      Certificate Management Team
    `
  });

  // For demo purposes, we'll show the credentials in an alert
  alert(`
    Credentials have been generated for: ${email}
    Password: ${password}
    
    In a real application, these would be sent via email.
  `);
}; 