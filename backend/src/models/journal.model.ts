import mongoose from 'mongoose';

export interface IJournal extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood?: 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral';
  tags?: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'neutral'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
journalSchema.index({ userId: 1, createdAt: -1 });

export const Journal = mongoose.model<IJournal>('Journal', journalSchema); 