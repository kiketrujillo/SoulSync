// src/db/mongoose.ts
import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/soulsync';
    await mongoose.connect(mongoUri);
    console.log('✨ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
