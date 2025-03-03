// src/routes/soulGuideRoutes.ts
import express from 'express';
import { 
  getResponse, 
  getConversationHistory, 
  getConversation,
  analyzeJournalEntry,
  decodeDreamEntry
} from '../controllers/soulGuideController';
import { verifyToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Soul Guide can be used with or without authentication
router.post('/response', optionalAuth, getResponse);

// These routes require authentication
router.get('/conversations', verifyToken, getConversationHistory);
router.get('/conversations/:conversationId', verifyToken, getConversation);
router.post('/journal/analyze', verifyToken, analyzeJournalEntry);
router.post('/dream/decode', verifyToken, decodeDreamEntry);

export default router;
