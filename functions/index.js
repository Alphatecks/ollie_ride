/**
 * Cloud Function to send OTP emails via Firestore Triggers
 * 
 * Deploy with: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter (you'll need to set up your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: functions.config().gmail?.user || 'your-email@gmail.com',
    pass: functions.config().gmail?.password || 'your-app-password'
  }
});

// Trigger when OTP is created in Firestore
exports.sendOTPEmail = functions.firestore
  .document('otps/{email}')
  .onCreate(async (snapshot, context) => {
    const email = context.params.email;
    const otpData = snapshot.data();
    
    console.log(`Sending OTP to ${email}: ${otpData.code}`);
    
    const mailOptions = {
      from: 'noreply@ollieride.com',
      to: email,
      subject: 'Your OTP Code for OllieRide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to OllieRide</h2>
          <p>Your OTP code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 36px;">${otpData.code}</h1>
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error sending OTP email to ${email}:`, error);
    }
  });

