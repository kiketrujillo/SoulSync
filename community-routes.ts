// src/routes/communityRoutes.ts
import express from 'express';
import { 
  createMoonCircle, 
  getMoonCircles,
  getMyMoonCircles,
  getMoonCircle,
  joinMoonCircle,
  leaveMoonCircle,
  updateMoonCircle,
  deleteMoonCircle,
  regenerateInviteCode
} from '../controllers/communityController';
import { verifyToken, optionalAuth, isIncognitoUser } from '../middleware/auth';

const router = express.Router();

// Public routes (with optional auth)
router.get('/moon-circles', optionalAuth, getMoonCircles);
router.get('/moon-circles/:id', optionalAuth, getMoonCircle);

// Protected routes (require authentication)
router.use(verifyToken);

// Cannot participate in Moon Circles in incognito mode
router.use(isIncognitoUser);

router.post('/moon-circles', createMoonCircle);
router.get('/my-moon-circles', getMyMoonCircles);
router.post('/moon-circles/:id/join', joinMoonCircle);
router.post('/moon-circles/:id/leave', leaveMoonCircle);
router.put('/moon-circles/:id', updateMoonCircle);
router.delete('/moon-circles/:id', deleteMoonCircle);
router.post('/moon-circles/:id/regenerate-invite', regenerateInviteCode);

export default router;
