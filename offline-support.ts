// src/controllers/syncController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import Journal from '../models/journal';
import Altar from '../models/altar';
import { logger } from '../utils/logger';

// Interfaces for sync objects
interface SyncObject {
  id?: string | number;
  clientId: string;
  type: string;
  action: 'create' | 'update' | 'delete';
  timestamp: number;
  data: any;
}

interface SyncResponse {
  success: boolean;
  processed: SyncObject[];
  failed: { object: SyncObject; error: string }[];
  serverChanges: any[];
}

/**
 * Sync offline changes with server
 * Takes a batch of operations from client and processes them
 */
export const syncChanges = async (req: Request, res: Response) => {
  try {
    const { changes, lastSyncTimestamp } = req.body;
    const userId = req.user.id;
    
    if (!Array.isArray(changes)) {
      return res.status(400).json({
        success: false,
        message: 'Changes must be an array of operations'
      });
    }
    
    logger.info(`Processing ${changes.length} changes for user ${userId}`);
    
    // Process each change and track results
    const processed: SyncObject[] = [];
    const failed: { object: SyncObject; error: string }[] = [];
    
    for (const change of changes) {
      try {
        // Validate the change object
        if (!change.clientId || !change.type || !change.action || !change.timestamp) {
          failed.push({ 
            object: change, 
            error: 'Invalid change object structure' 
          });
          continue;
        }
        
        // Process based on type and action
        switch (change.type) {
          case 'journal':
            await processJournalChange(userId, change);
            break;
          case 'altar':
            await processAltarChange(userId, change);
            break;
          case 'mood':
            await processMoodChange(userId, change);
            break;
          case 'preference':
            await processPreferenceChange(userId, change);
            break;
          default:
            failed.push({ 
              object: change, 
              error: `Unknown change type: ${change.type}` 
            });
            continue;
        }
        
        // If we got here, the change was processed successfully
        processed.push(change);
        
      } catch (error) {
        logger.error('Error processing change:', error);
        failed.push({ 
          object: change, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    // Get server changes since last sync
    const lastSync = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);
    const serverChanges = await getServerChanges(userId, lastSync);
    
    res.status(200).json({
      success: true,
      processed,
      failed,
      serverChanges,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Process a journal change
 */
async function processJournalChange(userId: number, change: SyncObject): Promise<void> {
  switch (change.action) {
    case 'create':
      // Create a new journal entry
      const newEntry = new Journal({
        userId,
        clientId: change.clientId,
        entry: change.data.entry,
        mood: change.data.mood,
        tags: change.data.tags || [],
        createdAt: new Date(change.timestamp)
      });
      await newEntry.save();
      break;
      
    case 'update':
      // Update an existing journal entry
      await Journal.findOneAndUpdate(
        { userId, clientId: change.clientId },
        {
          entry: change.data.entry,
          mood: change.data.mood,
          tags: change.data.tags,
          updatedAt: new Date()
        }
      );
      break;
      
    case 'delete':
      // Delete a journal entry
      await Journal.findOneAndDelete({ userId, clientId: change.clientId });
      break;
      
    default:
      throw new Error(`Unknown action: ${change.action}`);
  }
}

/**
 * Process an altar change
 */
async function processAltarChange(userId: number, change: SyncObject): Promise<void> {
  switch (change.action) {
    case 'create':
      // Create a new altar
      const newAltar = new Altar({
        userId,
        clientId: change.clientId,
        name: change.data.name || 'My Sacred Space',
        items: change.data.items || [],
        intentions: change.data.intentions || [],
        theme: change.data.theme || 'default',
        backgroundImage: change.data.backgroundImage,
        createdAt: new Date(change.timestamp)
      });
      await newAltar.save();
      break;
      
    case 'update':
      // Update an existing altar
      await Altar.findOneAndUpdate(
        { userId, clientId: change.clientId },
        {
          name: change.data.name,
          items: change.data.items,
          intentions: change.data.intentions,
          theme: change.data.theme,
          backgroundImage: change.data.backgroundImage,
          updatedAt: new Date()
        }
      );
      break;
      
    case 'delete':
      // Delete an altar
      await Altar.findOneAndDelete({ userId, clientId: change.clientId });
      break;
      
    default:
      throw new Error(`Unknown action: ${change.action}`);
  }
}

/**
 * Process a mood change
 */
async function processMoodChange(userId: number, change: SyncObject): Promise<void> {
  // Store mood history in SQL database
  await prisma.moodHistory.create({
    data: {
      userId,
      mood: change.data.mood,
      note: change.data.note || '',
      recordedAt: new Date(change.timestamp)
    }
  });
}

/**
 * Process a preference change
 */
async function processPreferenceChange(userId: number, change: SyncObject): Promise<void> {
  // Update user preferences
  await prisma.userPreference.upsert({
    where: {
      userId_key: {
        userId,
        key: change.data.key
      }
    },
    update: {
      value: change.data.value,
      updatedAt: new Date()
    },
    create: {
      userId,
      key: change.data.key,
      value: change.data.value
    }
  });
}

/**
 * Get changes from server since last sync
 */
async function getServerChanges(userId: number, lastSync: Date): Promise<any[]> {
  // Get journal changes
  const journalChanges = await Journal.find({
    userId,
    $or: [
      { createdAt: { $gt: lastSync } },
      { updatedAt: { $gt: lastSync } }
    ]
  });
  
  // Get altar changes
  const altarChanges = await Altar.find({
    userId,
    $or: [
      { createdAt: { $gt: lastSync } },
      { updatedAt: { $gt: lastSync } }
    ]
  });
  
  // Get mood history changes
  const moodChanges = await prisma.moodHistory.findMany({
    where: {
      userId,
      recordedAt: {
        gt: lastSync
      }
    }
  });
  
  // Get preference changes
  const preferenceChanges = await prisma.userPreference.findMany({
    where: {
      userId,
      updatedAt: {
        gt: lastSync
      }
    }
  });
  
  // Format all changes for client
  return [
    ...journalChanges.map(journal => ({
      type: 'journal',
      id: journal._id.toString(),
      clientId: journal.clientId,
      data: journal,
      timestamp: journal.updatedAt || journal.createdAt
    })),
    ...altarChanges.map(altar => ({
      type: 'altar',
      id: altar._id.toString(),
      clientId: altar.clientId,
      data: altar,
      timestamp: altar.updatedAt || altar.createdAt
    })),
    ...moodChanges.map(mood => ({
      type: 'mood',
      id: mood.id,
      data: {
        mood: mood.mood,
        note: mood.note,
        recordedAt: mood.recordedAt
      },
      timestamp: mood.recordedAt
    })),
    ...preferenceChanges.map(pref => ({
      type: 'preference',
      id: pref.id,
      data: {
        key: pref.key,
        value: pref.value
      },
      timestamp: pref.updatedAt
    }))
  ];
}

/**
 * Get initial data for offline cache
 * This endpoint provides essential data for the client to function offline
 */
export const getOfflineData = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        zodiacSign: true,
        element: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get recent journals (last 10)
    const journals = await Journal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get altars
    const altars = await Altar.find({ userId });
    
    // Get latest mood
    const latestMood = await prisma.moodHistory.findFirst({
      where: { userId },
      orderBy: { recordedAt: 'desc' }
    });
    
    // Get user preferences
    const preferences = await prisma.userPreference.findMany({
      where: { userId }
    });
    
    // Get essential tarot card data
    const tarotCards = await prisma.tarotCard.findMany({
      take: 10 // Just get a few for offline mode
    });
    
    // Get a few rituals
    const rituals = await prisma.ritual.findMany({
      take: 5 // Just get a few for offline mode
    });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        journals,
        altars,
        mood: latestMood,
        preferences: preferences.reduce((acc, pref) => {
          acc[pref.key] = pref.value;
          return acc;
        }, {} as Record<string, string>),
        content: {
          tarotCards,
          rituals
        },
        timestamp: Date.now()
      }
    });
  } catch (error) {
    logger.error('Get offline data error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
