import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { mlService } from '../services/ml.service';
import { alertService } from '../services/alert.service';

const router = express.Router();

// Get mental health analysis
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const analysis = await mlService.calculateMentalHealthScore(req.user.userId);
    
    // Check for alerts in the background
    alertService.checkAndSendAlerts(req.user.userId).catch(console.error);
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing mental health data', error });
  }
});

// Update FCM token for push notifications
router.post('/fcm-token', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    await alertService.updateFCMToken(req.user.userId, token);
    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating FCM token', error });
  }
});

export default router; 