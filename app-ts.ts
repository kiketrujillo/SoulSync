// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectMongo } from './db/mongoose';

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

// Import routes (to be defined)
// User routes
// Astrology routes
// Soul Guide routes
// Content routes
// Community routes

export default app;
