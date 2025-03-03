// src/controllers/questController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { getCurrentTransits } from '../services/astroService';

/**
 * Get all available quests
 */
export const getAllQuests = async (req: Request, res: Response) => {
  try {
    // Get filter params
    const { cosmicEvent } = req.query;
    
    // Build where clause
    const where: any = {};
    if (cosmicEvent) where.cosmicEvent = String(cosmicEvent);
    
    // Fetch quests
    const quests = await prisma.quest.findMany({
      where,
      orderBy: { id: 'asc' }
    });
    
    res.status(200).json({
      success: true,
      data: quests
    });
  } catch (error) {
    console.error('Get all quests error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific quest
 */
export const getQuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch quest
    const quest = await prisma.quest.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'This quest does not exist in our cosmic registry.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: quest
    });
  } catch (error) {
    console.error('Get quest error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get recommended quests based on transits
 */
export const getRecommendedQuests = async (req: Request, res: Response) => {
  try {
    // Get current transits
    const transits = await getCurrentTransits();
    
    // Fetch quests based on current cosmic events
    // In a real app, this would be more sophisticated
    let quests = await prisma.quest.findMany({
      where: {
        OR: [
          { cosmicEvent: transits.moonPhase },
          { cosmicEvent: transits.planets[0].sign }
        ]
      }
    });
    
    // If no specific quests found, get generic ones
    if (quests.length === 0) {
      quests = await prisma.quest.findMany({
        take: 3
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        quests,
        cosmicContext: {
          moonPhase: transits.moonPhase,
          significantPlanet: transits.planets[0].name,
          planetSign: transits.planets[0].sign
        }
      }
    });
  } catch (error) {
    console.error('Get recommended quests error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Start a quest
 */
export const startQuest = async (req: Request, res: Response) => {
  try {
    const { questId } = req.body;
    const userId = req.user.id;
    
    if (!questId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a quest ID to begin your cosmic journey.'
      });
    }
    
    // Check if quest exists
    const quest = await prisma.quest.findUnique({
      where: { id: parseInt(questId) }
    });
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'This quest does not exist in our cosmic registry.'
      });
    }
    
    // Check if user already started this quest
    const existingProgress = await prisma.questProgress.findFirst({
      where: {
        userId,
        questId: parseInt(questId),
        completed: false
      }
    });
    
    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'You have already embarked on this quest. Continue your journey!'
      });
    }
    
    // Start the quest
    const questProgress = await prisma.questProgress.create({
      data: {
        userId,
        questId: parseInt(questId),
        progress: 0,
        currentStep: 0,
        completed: false
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'You have embarked on a new cosmic quest!',
      data: {
        questProgress,
        quest
      }
    });
  } catch (error) {
    console.error('Start quest error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Update quest progress
 */
export const updateQuestProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress, currentStep, completed } = req.body;
    const userId = req.user.id;
    
    // Find the quest progress
    const questProgress = await prisma.questProgress.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: {
        quest: true
      }
    });
    
    if (!questProgress) {
      return res.status(404).json({
        success: false,
        message: 'This quest progress does not exist in your cosmic journey.'
      });
    }
    
    // Update progress
    const updatedProgress = await prisma.questProgress.update({
      where: { id: parseInt(id) },
      data: {
        progress: progress !== undefined ? progress : questProgress.progress,
        currentStep: currentStep !== undefined ? currentStep : questProgress.currentStep,
        completed: completed !== undefined ? completed : questProgress.completed
      }
    });
    
    // If quest completed, potentially unlock a skill
    if (completed && !questProgress.completed) {
      // In a real app, this would be more sophisticated with specific mappings
      try {
        // Find related skill based on quest category
        const relatedSkill = await prisma.skillTree.findFirst({
          where: {
            category: questProgress.quest.cosmicEvent || 'General'
          }
        });
        
        if (relatedSkill) {
          // Check if user already has this skill
          const existingSkill = await prisma.skillTreeProgress.findFirst({
            where: {
              userId,
              skillTreeId: relatedSkill.id
            }
          });
          
          if (!existingSkill) {
            // Unlock the skill
            await prisma.skillTreeProgress.create({
              data: {
                userId,
                skillTreeId: relatedSkill.id,
                progress: 10, // Starting progress
                completed: false
              }
            });
          } else {
            // Increase skill progress
            await prisma.skillTreeProgress.update({
              where: { id: existingSkill.id },
              data: { 
                progress: Math.min(100, existingSkill.progress + 10),
                completed: existingSkill.progress + 10 >= 100
              }
            });
          }
        }
      } catch (skillError) {
        console.error('Skill unlock error:', skillError);
        // Continue with quest completion even if skill unlock fails
      }
    }
    
    res.status(200).json({
      success: true,
      message: completed && !questProgress.completed 
        ? 'Congratulations! You have completed this cosmic quest!' 
        : 'Your quest progress has been updated.',
      data: updatedProgress
    });
  } catch (error) {
    console.error('Update quest progress error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get all active quests for a user
 */
export const getActiveQuests = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get active quests
    const activeQuests = await prisma.questProgress.findMany({
      where: {
        userId,
        completed: false
      },
      include: {
        quest: true
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: activeQuests
    });
  } catch (error) {
    console.error('Get active quests error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get completed quests for a user
 */
export const getCompletedQuests = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get completed quests
    const completedQuests = await prisma.questProgress.findMany({
      where: {
        userId,
        completed: true
      },
      include: {
        quest: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: completedQuests
    });
  } catch (error) {
    console.error('Get completed quests error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
