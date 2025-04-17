import nodemailer from 'nodemailer';
import twilio from 'twilio';
import admin from 'firebase-admin';
import { logger } from '../utils/logger';
import { Alert } from '../models/alert.model';

class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;
  private firebaseApp: admin.app.App;

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Initialize Firebase Admin
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
      });
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      logger.info(`SMS sent to ${to}`);
    } catch (error) {
      logger.error('SMS sending failed:', error);
      throw error;
    }
  }

  async sendPushNotification(token: string, title: string, body: string): Promise<void> {
    try {
      await this.firebaseApp.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
      logger.info(`Push notification sent to token: ${token}`);
    } catch (error) {
      logger.error('Push notification sending failed:', error);
      throw error;
    }
  }

  async notifyEmergencyContacts(alert: Alert): Promise<void> {
    const locationUrl = `https://www.google.com/maps?q=${alert.location.coordinates[0]},${alert.location.coordinates[1]}`;
    const message = `EMERGENCY ALERT: ${alert.user.name} needs help!\nLocation: ${locationUrl}\nMessage: ${alert.message || 'No additional message'}`;

    for (let i = 0; i < alert.emergencyContacts.length; i++) {
      const contact = alert.emergencyContacts[i];
      
      try {
        // Send SMS
        if (contact.phoneNumber) {
          await this.sendSMS(contact.phoneNumber, message);
        }

        // Send email if available
        if (contact.email) {
          await this.sendEmail(contact.email, 'EMERGENCY ALERT', message);
        }

        // Mark contact as notified
        await alert.markContactNotified(i);
      } catch (error) {
        logger.error(`Failed to notify emergency contact ${contact.name}:`, error);
      }
    }
  }
}

export const notificationService = new NotificationService(); 