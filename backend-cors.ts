// backend/src/app.ts (update)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { register, login, getProfile } from './controllers/userController';
import { verifyToken } from './middleware/auth';
import { getChart, getTransits } from './controllers/astroController';
import { getResponse } from './controllers/soulGuideController';
import { pullCard } from './controllers/tarotController';

dotenv.config();
const app = express();

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000',                // Local development frontend
  'https://soulsync.app',                 // Production domain
  'https://dev.soulsync.app',             // Development domain
  process.env.FRONTEND_URL || ''          // From environment variable
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => res.send('SoulSync Backend is Live!'));

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/user/profile', verifyToken, getProfile);

// Astrology routes
app.get('/api/astro/chart', verifyToken, getChart);
app.get('/api/astro/transits', verifyToken, getTransits);

// Soul Guide route
app.post('/api/soul-guide', verifyToken, getResponse);

// Tarot route
app.get('/api/tarot/pull', verifyToken, pullCard);

export default app;
