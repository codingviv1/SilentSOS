import mongoose from 'mongoose';

export interface IMood extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  mood: 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral';
  intensity: number;
  notes?: string;
  createdAt: Date;
}

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'neutral'],
    required: true,
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Mood = mongoose.model<IMood>('Mood', moodSchema); 