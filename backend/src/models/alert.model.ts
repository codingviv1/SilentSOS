import mongoose from 'mongoose';
import { IUser } from './user.model';

export interface IAlert extends mongoose.Document {
  user: IUser['_id'];
  status: 'active' | 'resolved' | 'cancelled';
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  message?: string;
  emergencyContacts: Array<{
    name: string;
    phoneNumber: string;
    notified: boolean;
    notifiedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  cancelledAt?: Date;
}

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: String,
  },
  message: String,
  emergencyContacts: [{
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: Date,
  }],
  resolvedAt: Date,
  cancelledAt: Date,
}, {
  timestamps: true,
});

// Create geospatial index for location
alertSchema.index({ location: '2dsphere' });

// Add method to update alert status
alertSchema.methods.updateStatus = async function(
  newStatus: 'resolved' | 'cancelled'
): Promise<void> {
  this.status = newStatus;
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  await this.save();
};

// Add method to mark contact as notified
alertSchema.methods.markContactNotified = async function(
  contactIndex: number
): Promise<void> {
  if (this.emergencyContacts[contactIndex]) {
    this.emergencyContacts[contactIndex].notified = true;
    this.emergencyContacts[contactIndex].notifiedAt = new Date();
    await this.save();
  }
};

export const Alert = mongoose.model<IAlert>('Alert', alertSchema); 