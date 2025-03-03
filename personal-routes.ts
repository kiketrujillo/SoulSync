// src/routes/personalRoutes.ts
import express from 'express';
import { 
  createEntry, 
  getEntries, 
  getEntry, 
  updateEntry, 
  deleteEntry 
} from '../controllers/journalController';
import { 
  createAltar, 
  getAltars, 
  getAltar, 
  updateAltar, 
  addItem,
  removeItem,
  deleteAltar 
} from '../controllers/altarController';
import { verifyToken, isIncognitoUser } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Journal routes - most of these are not available in incognito mode
router.post('/journal', createEntry);
router.get('/journal', getEntries);
router.get('/journal/:id', getEntry);
router.put('/journal/:id', updateEntry);
router.delete('/journal/:id', deleteEntry);

// Altar routes
router.post('/altar', isIncognitoUser, createAltar);
router.get('/altar', getAltars);
router.get('/altar/:id', getAltar);
router.put('/altar/:id', isIncognitoUser, updateAltar);
router.post('/altar/:id/item', isIncognitoUser, addItem);
router.delete('/altar/:id/item/:itemIndex', isIncognitoUser, removeItem);
router.delete('/altar/:id', isIncognitoUser, deleteAltar);

export default router;
