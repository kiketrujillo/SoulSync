// src/models/altar.ts
import mongoose from 'mongoose';

const altarItemSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['candle', 'crystal', 'tarot', 'incense', 'flower', 'symbol', 'other'] 
  },
  name: { 
    type: String, 
    required: true 
  },
  intention: { 
    type: String 
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, default: 0 }
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  attributes: {
    color: String,
    element: String,
    energy: String,
    size: String
  }
});

const altarSchema = new mongoose.Schema({
  userId: { 
    type: Number, 
    required: true, 
    index: true 
  },
  clientId: { 
    type: String,
    required: true,
    index: true
  },
  name: { 
    type: String, 
    default: 'My Sacred Space' 
  },
  description: { 
    type: String 
  },
  items: [altarItemSchema],
  intentions: [{ 
    type: String 
  }],
  theme: { 
    type: String, 
    default: 'default' 
  },
  backgroundImage: { 
    type: String 
  },
  energyLevel: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 50 
  },
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
altarSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Compound index for userId and clientId to ensure uniqueness
altarSchema.index({ userId: 1, clientId: 1 }, { unique: true });

export default mongoose.model('Altar', altarSchema);
