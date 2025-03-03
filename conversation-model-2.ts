// src/models/conversation.ts
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'soul-guide'] 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  mood: { 
    type: String 
  },
  context: {
    astrological: {
      transits: [String],
      significantPlanets: [String]
    },
    tarot: {
      cards: [String]
    }
  },
  clientId: {
    type: String
  }
});

const conversationSchema = new mongoose.Schema({
  userId: { 
    type: Number, 
    required: true, 
    index: true 
  },
  clientId: { 
    type: String,
    index: true
  },
  title: { 
    type: String, 
    default: function() {
      return `Conversation ${new Date().toLocaleString()}`;
    }
  },
  messages: [messageSchema],
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastSyncedAt: {
    type: Date
  }
});

// Pre-save hook to update updatedAt field
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for client ID for offline syncing
conversationSchema.index({ userId: 1, clientId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Conversation', conversationSchema);
