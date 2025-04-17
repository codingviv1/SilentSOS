import express, { Request, Response } from 'express';
import { Journal } from '../models/journal.model';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all journal entries for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const journals = await Journal.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journal entries', error });
  }
});

// Create a new journal entry
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, content, mood, tags, isPrivate } = req.body;
    const newJournal = new Journal({
      userId: req.user.userId,
      title,
      content,
      mood,
      tags,
      isPrivate,
    });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating journal entry', error });
  }
});

// Get a specific journal entry
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journal entry', error });
  }
});

// Update a journal entry
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, content, mood, tags, isPrivate } = req.body;
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, mood, tags, isPrivate },
      { new: true }
    );
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal entry', error });
  }
});

// Delete a journal entry
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal entry', error });
  }
});

export default router; 