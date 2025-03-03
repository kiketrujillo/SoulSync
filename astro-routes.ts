// src/routes/astroRoutes.ts
import express from 'express';
import { getChart, getTransits, getInsights, getCosmicCalendar } from '../controllers/astroController';
import { verifyToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Protected routes requiring authentication
router.get('/chart', verifyToken, getChart);
router.get('/insights', verifyToken, getInsights);

// Routes with optional authentication
router.get('/transits', optionalAuth, getTransits);
router.get('/calendar', optionalAuth, getCosmicCalendar);

export default router;
