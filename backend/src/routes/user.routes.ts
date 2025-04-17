import express from 'express';
import { body, validationResult } from 'express-validator';
import { User, IUser } from '../models/user.model';
import { auth } from '../middleware/auth';
import { Request, Response } from 'express';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phoneNumber').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, phoneNumber } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        email,
        password,
        name,
        phoneNumber,
        emergencyContacts: [],
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          language: 'en',
          theme: 'system',
        },
      });

      await user.save();

      // Generate auth token
      const token = await user.generateAuthToken();

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate auth token
      const token = await user.generateAuthToken();

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Get user profile
router.get('/profile', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user profile
router.patch(
  '/profile',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phoneNumber').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
    body('preferences.notifications.email').optional().isBoolean(),
    body('preferences.notifications.sms').optional().isBoolean(),
    body('preferences.notifications.push').optional().isBoolean(),
    body('preferences.language').optional().isIn(['en', 'es', 'fr', 'de']),
    body('preferences.theme').optional().isIn(['light', 'dark', 'system']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'phoneNumber', 'preferences'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      updates.forEach(update => {
        if (update === 'preferences') {
          user.preferences = { ...user.preferences, ...req.body.preferences };
        } else {
          user[update] = req.body[update];
        }
      });

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Add emergency contact
router.post(
  '/emergency-contacts',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Contact name is required'),
    body('phoneNumber').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number'),
    body('relationship').trim().notEmpty().withMessage('Relationship is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.emergencyContacts.push(req.body);
      await user.save();

      res.status(201).json(user.emergencyContacts);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Remove emergency contact
router.delete('/emergency-contacts/:id', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.emergencyContacts = user.emergencyContacts.filter(
      contact => contact._id.toString() !== req.params.id
    );

    await user.save();
    res.json(user.emergencyContacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update FCM token for push notifications
router.patch('/fcm-token', auth, async (req: Request, res: Response) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 