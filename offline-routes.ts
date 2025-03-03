// src/routes/syncRoutes.ts
import express from 'express';
import { syncChanges, getOfflineData } from '../controllers/syncController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Protected routes requiring authentication
router.use(verifyToken);

// Sync routes
router.post('/sync', syncChanges);
router.get('/offline-data', getOfflineData);

export default router;
