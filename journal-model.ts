// src/models/journal.ts
import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: { 
    type: Number, 
    required: true, 
    index: true 
  },
  entry: { 
    type: String, 
    required: true 
  },
  mood: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }],
  analysis: { 
    type: String 
  },
  dreamDecoding: { 
    type: String 
  },
  cosmicInsights: [{
    planet: String,
    aspect: String,
    interpretation: String
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save hook to update updatedAt field
journalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Journal', journalSchema);
