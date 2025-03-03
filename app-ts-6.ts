// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectMongo } from './db/mongoose';
import { apiLimiter, authLimiter, contentLimiter, initRedis, updateRateLimitStores } from './middleware/rateLimit';
import { logger, stream, requestLogger, logAppEvent } from './utils/logger';
import { validateEnvironment } from './utils/validateEnv';

// Initialize configuration
dotenv.config();

// Validate environment variables
validateEnvironment();

// Initialize Redis
initRedis().then(updateRateLimitStores);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined', { stream }));
app.use(requestLogger);

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
import healthRoutes from './routes/healthRoutes';

export default app;
