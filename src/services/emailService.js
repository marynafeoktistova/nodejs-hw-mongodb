import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: true,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export const sendResetPasswordEmail = async (to, token) => {
  const appDomain = getEnvVar('APP_DOMAIN');
  const resetUrl = `${appDomain}/reset-password?token=${token}`;

  const mailOptions = {
    from: getEnvVar('SMTP_FROM'),
    to,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error); // Ось тут побачимо справжню причину
    throw new Error('Failed to send the email, please try again later.');
  }
};
