// src/controllers/astroController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { generateNatalChart, getCurrentTransits, mapToKabbalah, getPersonalizedTransits } from '../services/astroService';
import { decrypt } from '../utils/encrypt';

/**
 * Get a user's natal chart
 */
export const getChart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user birth data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        isIncognito: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in the cosmic database.'
      });
    }
    
    // Format date
    const birthDate = user.birthDate.toISOString().split('T')[0];
    
    // Decrypt birth place if not in incognito mode
    let birthPlace = user.birthPlace;
    if (birthPlace && !user.isIncognito) {
      try {
        birthPlace = decrypt(birthPlace);
      } catch (error) {
        console.error('Decryption error:', error);
      }
    }
    
    // Generate chart
    const chart = await generateNatalChart(birthDate, user.birthTime || '', birthPlace || '');
    
    // Map to Kabbalah for the Living Soul Map
    const kabbalisticChart = {
      ...chart,
      planets: mapToKabbalah(chart.planets)
    };
    
    res.status(200).json({
      success: true,
      data: kabbalisticChart
    });
  } catch (error) {
    console.error('Get chart error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get current transits
 */
export const getTransits = async (req: Request, res: Response) => {
  try {
    // Get current transits
    const transits = await getCurrentTransits();
    
    // Add Kabbalistic mapping
    const kabbalisticTransits = {
      ...transits,
      planets: mapToKabbalah(transits.planets)
    };
    
    res.status(200).json({
      success: true,
      data: kabbalisticTransits
    });
  } catch (error) {
    console.error('Get transits error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get personalized transit insights
 */
export const getInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get user birth data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        isIncognito: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in the cosmic database.'
      });
    }
    
    // Format date
    const birthDate = user.birthDate.toISOString().split('T')[0];
    
    // Decrypt birth place if not in incognito mode
    let birthPlace = user.birthPlace;
    if (birthPlace && !user.isIncognito) {
      try {
        birthPlace = decrypt(birthPlace);
      } catch (error) {
        console.error('Decryption error:', error);
      }
    }
    
    // Generate natal chart
    const natalChart = await generateNatalChart(birthDate, user.birthTime || '', birthPlace || '');
    
    // Get current transits
    const currentTransits = await getCurrentTransits();
    
    // Generate personalized insights
    const insights = await getPersonalizedTransits(natalChart, currentTransits);
    
    res.status(200).json({
      success: true,
      data: {
        date: currentTransits.date,
        moonPhase: currentTransits.moonPhase,
        insights: insights
      }
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get cosmic calendar - upcoming significant astrological events
 */
export const getCosmicCalendar = async (req: Request, res: Response) => {
  try {
    // In a real application, this would query upcoming events from an astrology API
    // This is a simplified example with sample data
    
    const now = new Date();
    const upcomingEvents = [
      {
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        type: 'New Moon',
        description: 'A time for new beginnings and setting intentions.',
        element: 'Water',
        ritualSuggestion: 'Write down your intentions and meditate with a blue candle.'
      },
      {
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        type: 'Venus Enters Libra',
        description: 'A harmonious time for relationships and beauty.',
        element: 'Air',
        ritualSuggestion: 'Connect with a loved one or beautify your space.'
      },
      {
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
        type: 'Mercury Square Saturn',
        description: 'A time to be careful with communication and commitments.',
        element: 'Earth',
        ritualSuggestion: 'Journal about your responsibilities and boundaries.'
      },
      // More events would be included here
    ];
    
    res.status(200).json({
      success: true,
      data: upcomingEvents
    });
  } catch (error) {
    console.error('Get cosmic calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
