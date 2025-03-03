// src/routes/healthRoutes.ts
import express from 'express';
import { healthCheck, readyCheck } from '../controllers/healthController';

const router = express.Router();

// Health check endpoints
router.get('/health', healthCheck);
router.get('/ready', readyCheck);

export default router;
