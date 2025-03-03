// src/controllers/ritualController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { getCurrentTransits } from '../services/astroService';

/**
 * Get a ritual recommendation based on mood, transits, or other factors
 */
export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { mood, element } = req.query;
    
    // Get current transits for cosmic context
    const transits = await getCurrentTransits();
    
    // Build query based on provided parameters
    const query: any = {};
    
    if (mood) {
      query.targetMood = String(mood);
    }
    
    if (element) {
      query.element = String(element);
    } else if (req.user?.element) {
      // Use user's zodiac element if available and no specific element requested
      query.element = req.user.element;
    }
    
    // Try to find a ritual matching the moon phase if no other criteria
    if (!mood && !element && !req.user?.element) {
      query.moonPhase = transits.moonPhase;
    }
    
    // Find matching rituals
    let rituals = await prisma.ritual.findMany({
      where: query
    });
    
    // If no specific matches, get any rituals
    if (rituals.length === 0) {
      rituals = await prisma.ritual.findMany({
        take: 3
      });
    }
    
    // Select a random ritual from the matches
    const selectedRitual = rituals[Math.floor(Math.random() * rituals.length)];
    
    if (!selectedRitual) {
      return res.status(404).json({
        success: false,
        message: 'No ritual found for your cosmic needs at this moment.'
      });
    }
    
    // Add cosmic context
    const ritualWithContext = {
      ...selectedRitual,
      cosmicContext: {
        moonPhase: transits.moonPhase,
        significantPlanet: transits.planets[0].name,
        planetSign: transits.planets[0].sign
      }
    };
    
    res.status(200).json({
      success: true,
      data: ritualWithContext
    });
  } catch (error) {
    console.error('Get ritual recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific ritual by ID
 */
export const getRitual = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the ritual
    const ritual = await prisma.ritual.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!ritual) {
      return res.status(404).json({
        success: false,
        message: 'This ritual is not present in our cosmic collection.'
      });
    }
    
    // Get current transits for cosmic context
    const transits = await getCurrentTransits();
    
    // Add cosmic context
    const ritualWithContext = {
      ...ritual,
      cosmicContext: {
        moonPhase: transits.moonPhase,
        significantPlanet: transits.planets[0].name,
        planetSign: transits.planets[0].sign
      }
    };
    
    res.status(200).json({
      success: true,
      data: ritualWithContext
    });
  } catch (error) {
    console.error('Get ritual error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get all rituals
 */
export const getAllRituals = async (req: Request, res: Response) => {
  try {
    // Filter parameters
    const { moonPhase, element, targetMood } = req.query;
    
    // Build query based on provided parameters
    const query: any = {};
    
    if (moonPhase) query.moonPhase = String(moonPhase);
    if (element) query.element = String(element);
    if (targetMood) query.targetMood = String(targetMood);
    
    // Get rituals
    const rituals = await prisma.ritual.findMany({
      where: query
    });
    
    res.status(200).json({
      success: true,
      data: rituals
    });
  } catch (error) {
    console.error('Get all rituals error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get rituals for a specific moon phase
 */
export const getMoonPhaseRituals = async (req: Request, res: Response) => {
  try {
    // Get current moon phase if none provided
    let { moonPhase } = req.params;
    
    if (!moonPhase) {
      const transits = await getCurrentTransits();
      moonPhase = transits.moonPhase;
    }
    
    // Get rituals for this moon phase
    const rituals = await prisma.ritual.findMany({
      where: { moonPhase }
    });
    
    res.status(200).json({
      success: true,
      data: {
        moonPhase,
        rituals
      }
    });
  } catch (error) {
    console.error('Get moon phase rituals error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
