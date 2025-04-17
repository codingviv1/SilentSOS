import express, { Request, Response } from 'express';
import { Mood } from '../models/mood.model';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all moods for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching moods', error });
  }
});

// Create a new mood entry
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { mood, intensity, notes } = req.body;
    const newMood = new Mood({
      userId: req.user.userId,
      mood,
      intensity,
      notes,
    });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: 'Error creating mood entry', error });
  }
});

// Get mood statistics
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId });
    
    // Calculate mood distribution
    const moodDistribution = moods.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average intensity
    const avgIntensity = moods.reduce((sum, curr) => sum + curr.intensity, 0) / moods.length;

    res.json({
      moodDistribution,
      averageIntensity: avgIntensity,
      totalEntries: moods.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating mood statistics', error });
  }
});

export default router; 