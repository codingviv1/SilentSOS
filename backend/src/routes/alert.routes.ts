import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { Alert } from '../models/alert.model';
import { notificationService } from '../services/notification.service';
import { Request, Response } from 'express';
import { alertCreationLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Create a new alert
router.post(
  '/',
  auth,
  alertCreationLimiter,
  [
    body('location.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*').isNumeric().withMessage('Coordinates must be numbers'),
    body('message').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { location, message } = req.body;

      // Create new alert
      const alert = new Alert({
        user: req.user._id,
        location: {
          type: 'Point',
          coordinates: location.coordinates,
          address: location.address,
        },
        message,
        emergencyContacts: req.user.emergencyContacts.map(contact => ({
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          notified: false,
        })),
      });

      await alert.save();

      // Notify emergency contacts
      await notificationService.notifyEmergencyContacts(alert);

      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Get user's active alerts
router.get('/active', auth, async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({
      user: req.user._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get alert history
router.get('/history', auth, async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find({
      user: req.user._id,
      status: { $in: ['resolved', 'cancelled'] },
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update alert status
router.patch(
  '/:id/status',
  auth,
  [
    body('status')
      .isIn(['resolved', 'cancelled'])
      .withMessage('Status must be either resolved or cancelled'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const alert = await Alert.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }

      await alert.updateStatus(req.body.status);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Get alert details
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 