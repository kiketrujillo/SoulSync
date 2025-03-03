// src/routes/contentRoutes.ts
import express from 'express';
import { 
  pullCard, 
  getCard, 
  getAllCards, 
  getSpread 
} from '../controllers/tarotController';
import { 
  getRecommendation, 
  getRitual, 
  getAllRituals, 
  getMoonPhaseRituals 
} from '../controllers/ritualController';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

// Tarot routes
router.get('/tarot/pull', optionalAuth, pullCard);
router.get('/tarot/spread', optionalAuth, getSpread);
router.get('/tarot/cards', getAllCards);
router.get('/tarot/cards/:id', getCard);

// Ritual routes
router.get('/rituals/recommend', optionalAuth, getRecommendation);
router.get('/rituals', getAllRituals);
router.get('/rituals/:id', getRitual);
router.get('/rituals/moon-phase/:moonPhase', getMoonPhaseRituals);

export default router;
