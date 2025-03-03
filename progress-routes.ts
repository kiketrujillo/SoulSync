// src/routes/progressRoutes.ts
import express from 'express';
import { 
  getAllQuests,
  getQuest,
  getRecommendedQuests,
  startQuest,
  updateQuestProgress,
  getActiveQuests,
  getCompletedQuests
} from '../controllers/questController';
import { 
  getAllSkills,
  getSkill,
  getUserSkills,
  getAvailableSkills,
  updateSkillProgress,
  unlockSkill
} from '../controllers/skillController';
import { verifyToken, optionalAuth, isIncognitoUser } from '../middleware/auth';

const router = express.Router();

// Public routes (with optional auth)
router.get('/quests', optionalAuth, getAllQuests);
router.get('/quests/:id', optionalAuth, getQuest);
router.get('/quests/recommended/today', optionalAuth, getRecommendedQuests);

router.get('/skills', optionalAuth, getAllSkills);
router.get('/skills/:id', optionalAuth, getSkill);

// Protected routes (require authentication)
router.use(verifyToken);

// Cannot track progress in incognito mode
router.use(isIncognitoUser);

// Quest routes
router.post('/quests/start', startQuest);
router.put('/quest-progress/:id', updateQuestProgress);
router.get('/my-quests/active', getActiveQuests);
router.get('/my-quests/completed', getCompletedQuests);

// Skill routes
router.get('/my-skills', getUserSkills);
router.get('/my-skills/available', getAvailableSkills);
router.put('/skill-progress/:id', updateSkillProgress);
router.post('/skills/:id/unlock', unlockSkill);

export default router;
