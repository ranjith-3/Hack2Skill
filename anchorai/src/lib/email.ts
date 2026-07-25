// ============================================================
// AnchorAI — Email Notification Service
// Sends caregiver alerts via Nodemailer
// Automatically falls back to Ethereal Email (testing) if no SMTP config is provided
// ============================================================

import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  userEmail?: string;
  userName?: string;
}

export async function sendEmail({ to, subject, text, html, userEmail, userName }: SendEmailParams) {
  let transporter;

  // If real SMTP credentials are provided in .env, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback for Hackathon Demo / Testing Mode (Ethereal Email)
    console.log('[Email] No SMTP config found. Generating testing account via Ethereal...');
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });
  }

  // Construct sender name
  const senderName = userName ? `${userName} (AnchorAI)` : 'AnchorAI Support System';

  // Send the email
  const info = await transporter.sendMail({
    from: `"${senderName}" <no-reply@anchorai.app>`,
    replyTo: userEmail || 'no-reply@anchorai.app',
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'), // Simple HTML fallback
  });

  console.log(`[Email] Message sent: ${info.messageId}`);
  
  // If we used the test account, provide the preview URL in console
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Email] 🟢 TEST EMAIL PREVIEW URL: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
  };
}
