// src/routes/userRoutes.ts
import express from 'express';
import { register, login, getProfile, updateProfile, deleteAccount } from '../controllers/userController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/account', verifyToken, deleteAccount);

export default router;
