// src/controllers/skillController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';

/**
 * Get all skill tree nodes
 */
export const getAllSkills = async (req: Request, res: Response) => {
  try {
    // Get filter params
    const { category } = req.query;
    
    // Build where clause
    const where: any = {};
    if (category) where.category = String(category);
    
    // Fetch skills
    const skills = await prisma.skillTree.findMany({
      where,
      orderBy: { level: 'asc' }
    });
    
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific skill
 */
export const getSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch skill
    const skill = await prisma.skillTree.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'This cosmic skill does not exist in our registry.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get user's skill tree progress
 */
export const getUserSkills = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all skills
    const allSkills = await prisma.skillTree.findMany({
      orderBy: [
        { category: 'asc' },
        { level: 'asc' }
      ]
    });
    
    // Get user's skill progress
    const userSkillProgress = await prisma.skillTreeProgress.findMany({
      where: { userId },
      include: { skillTree: true }
    });
    
    // Map all skills with user progress
    const skillsWithProgress = allSkills.map(skill => {
      const userProgress = userSkillProgress.find(p => p.skillTreeId === skill.id);
      
      return {
        ...skill,
        progress: userProgress ? userProgress.progress : 0,
        completed: userProgress ? userProgress.completed : false,
        unlockedAt: userProgress ? userProgress.unlockedAt : null,
        unlocked: !!userProgress
      };
    });
    
    // Group by category for easier frontend processing
    const skillsByCategory = skillsWithProgress.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
    
    res.status(200).json({
      success: true,
      data: {
        skills: skillsWithProgress,
        skillsByCategory
      }
    });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get available skills (skills that can be unlocked)
 */
export const getAvailableSkills = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user's current skills
    const userSkills = await prisma.skillTreeProgress.findMany({
      where: { userId },
      select: { skillTreeId: true }
    });
    
    const userSkillIds = userSkills.map(s => s.skillTreeId);
    
    // Find skills that don't have parent or user has unlocked the parent
    const availableSkills = await prisma.skillTree.findMany({
      where: {
        id: { notIn: userSkillIds },
        OR: [
          { parentId: null },
          { parentId: { in: userSkillIds } }
        ]
      }
    });
    
    res.status(200).json({
      success: true,
      data: availableSkills
    });
  } catch (error) {
    console.error('Get available skills error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Update skill progress
 */
export const updateSkillProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;
    const userId = req.user.id;
    
    // Find the skill progress
    const skillProgress = await prisma.skillTreeProgress.findFirst({
      where: {
        skillTreeId: parseInt(id),
        userId
      },
      include: {
        skillTree: true
      }
    });
    
    if (!skillProgress) {
      return res.status(404).json({
        success: false,
        message: 'You have not unlocked this cosmic skill yet.'
      });
    }
    
    // Update progress
    const updatedProgress = await prisma.skillTreeProgress.update({
      where: { id: skillProgress.id },
      data: {
        progress: progress !== undefined ? progress : skillProgress.progress,
        completed: completed !== undefined ? completed : skillProgress.completed
      }
    });
    
    // If skill completed, check if any child skills should be unlocked
    if (completed && !skillProgress.completed) {
      try {
        // Find child skills
        const childSkills = await prisma.skillTree.findMany({
          where: { parentId: parseInt(id) }
        });
        
        // Unlock each child skill
        for (const childSkill of childSkills) {
          // Check if already unlocked
          const existingProgress = await prisma.skillTreeProgress.findFirst({
            where: {
              userId,
              skillTreeId: childSkill.id
            }
          });
          
          if (!existingProgress) {
            await prisma.skillTreeProgress.create({
              data: {
                userId,
                skillTreeId: childSkill.id,
                progress: 0,
                completed: false
              }
            });
          }
        }
      } catch (unlockError) {
        console.error('Child skill unlock error:', unlockError);
        // Continue with skill completion even if unlock fails
      }
    }
    
    res.status(200).json({
      success: true,
      message: completed && !skillProgress.completed 
        ? `Congratulations! You have mastered the ${skillProgress.skillTree.name} skill!` 
        : 'Your skill progress has been updated.',
      data: updatedProgress
    });
  } catch (error) {
    console.error('Update skill progress error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Unlock a skill directly (admin or special events)
 */
export const unlockSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if skill exists
    const skill = await prisma.skillTree.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'This cosmic skill does not exist in our registry.'
      });
    }
    
    // Check if already unlocked
    const existingProgress = await prisma.skillTreeProgress.findFirst({
      where: {
        userId,
        skillTreeId: parseInt(id)
      }
    });
    
    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'You have already unlocked this cosmic skill.'
      });
    }
    
    // Check if parent skill is unlocked (if parent exists)
    if (skill.parentId) {
      const parentUnlocked = await prisma.skillTreeProgress.findFirst({
        where: {
          userId,
          skillTreeId: skill.parentId
        }
      });
      
      if (!parentUnlocked) {
        return res.status(400).json({
          success: false,
          message: 'You must unlock the prerequisite skill first.'
        });
      }
    }
    
    // Unlock the skill
    const newProgress = await prisma.skillTreeProgress.create({
      data: {
        userId,
        skillTreeId: parseInt(id),
        progress: 0,
        completed: false
      }
    });
    
    res.status(201).json({
      success: true,
      message: `You have unlocked the ${skill.name} skill!`,
      data: {
        skillProgress: newProgress,
        skill
      }
    });
  } catch (error) {
    console.error('Unlock skill error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
