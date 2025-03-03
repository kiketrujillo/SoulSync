// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectMongo } from './db/mongoose';
import { apiLimiter, authLimiter, contentLimiter } from './middleware/rateLimit';

// Initialize configuration
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => res.send('SoulSync Backend is Live! ✨'));

// Import routes
import userRoutes from './routes/userRoutes';
import astroRoutes from './routes/astroRoutes';
import soulGuideRoutes from './routes/soulGuideRoutes';
import contentRoutes from './routes/contentRoutes';
import personalRoutes from './routes/personalRoutes';
import communityRoutes from './routes/communityRoutes';
import progressRoutes from './routes/progressRoutes';

export default app;
