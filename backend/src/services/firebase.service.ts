import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export class FirebaseService {
  private messaging = getMessaging();

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await this.messaging.send(message);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendMultipleNotifications(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    try {
      const message = {
        tokens,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await this.messaging.sendMulticast(message);
      return response;
    } catch (error) {
      console.error('Error sending multiple notifications:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService(); 