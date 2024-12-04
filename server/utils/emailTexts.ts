export const emailTextApproved = (
  alumniName: string,
  loginId: string,
  temporaryPassword: string,
  loginUrl: string
): string => {
  return `
Dear ${alumniName},

We are pleased to inform you that your registration to the GMRIT Alumni Network has been approved! Welcome to our vibrant alumni community.

Here are your login details to access your alumni account:

Login ID: ${loginId}
Temporary Password: ${temporaryPassword}

To complete the process, please log in to your account using the link below and update your password at your earliest convenience:
${loginUrl}

Steps to Update Your Password:
1. Visit the login page: ${loginUrl}
2. Log in with the credentials provided above.
3. Navigate to the 'Update Password' section to set your new secure password.

Please note that your Login ID cannot be changed, and it will be your permanent identifier in the system.

If you have any questions or face any issues while logging in, feel free to contact our support team at [Support Email].

We are excited to have you on board, and we look forward to staying connected and supporting your journey ahead.

Best regards,
GMRIT Alumni Network Team
[Contact Information]
`;
};
