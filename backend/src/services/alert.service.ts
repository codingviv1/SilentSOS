import { Server } from 'socket.io';
import { firebaseService } from './firebase.service';
import { mlService } from './ml.service';
import { User } from '../models/user.model';

interface AlertThresholds {
  moodScore: number;
  journalScore: number;
  consecutiveNegativeDays: number;
}

export class AlertService {
  private io: Server;
  private thresholds: AlertThresholds = {
    moodScore: 30,
    journalScore: 30,
    consecutiveNegativeDays: 3
  };

  constructor(io: Server) {
    this.io = io;
  }

  async checkAndSendAlerts(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const healthScore = await mlService.calculateMentalHealthScore(userId);
      
      // Check for concerning patterns
      const alerts = this.detectConcerningPatterns(healthScore);
      
      if (alerts.length > 0) {
        // Send real-time alert via Socket.IO
        this.io.to(userId).emit('alert', {
          type: 'health_concern',
          message: alerts.join('\n'),
          timestamp: new Date()
        });

        // Send push notification if user has FCM token
        if (user.fcmToken) {
          await firebaseService.sendNotification(
            user.fcmToken,
            'Health Concern Detected',
            alerts[0], // Send first alert as notification
            {
              type: 'health_concern',
              userId: userId.toString()
            }
          );
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }

  private detectConcerningPatterns(healthScore: any): string[] {
    const alerts: string[] = [];

    if (healthScore.overallScore < this.thresholds.moodScore) {
      alerts.push('Your overall mental health score is lower than usual. Consider reaching out for support.');
    }

    if (healthScore.moodScore < this.thresholds.moodScore) {
      alerts.push('Your mood has been consistently low. Try engaging in mood-boosting activities.');
    }

    if (healthScore.journalScore < this.thresholds.journalScore) {
      alerts.push('Your journal entries show concerning patterns. Consider talking to someone about how you\'re feeling.');
    }

    return alerts;
  }

  // Update user's FCM token
  async updateFCMToken(userId: string, token: string) {
    try {
      await User.findByIdAndUpdate(userId, { fcmToken: token });
    } catch (error) {
      console.error('Error updating FCM token:', error);
      throw error;
    }
  }
} 