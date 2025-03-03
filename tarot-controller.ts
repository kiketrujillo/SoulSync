// src/controllers/tarotController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { getCurrentTransits } from '../services/astroService';

/**
 * Pull a random tarot card
 */
export const pullCard = async (req: Request, res: Response) => {
  try {
    const { mood } = req.query;
    
    // Get all tarot cards
    const allCards = await prisma.tarotCard.findMany();
    
    if (allCards.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'The tarot deck is missing from our cosmic inventory.'
      });
    }
    
    let selectedCard;
    
    // If mood is provided, try to find a card that resonates with the mood
    if (mood) {
      // Find cards that relate to the mood (simple version - in production this would be more sophisticated)
      const moodString = String(mood).toLowerCase();
      const relatedCards = allCards.filter(card => {
        const keywords = card.keywords.map(k => k.toLowerCase());
        return keywords.some(keyword => keyword.includes(moodString) || moodString.includes(keyword));
      });
      
      // If we found related cards, select one randomly
      if (relatedCards.length > 0) {
        selectedCard = relatedCards[Math.floor(Math.random() * relatedCards.length)];
      }
    }
    
    // If no mood provided or no related cards found, select a completely random card
    if (!selectedCard) {
      selectedCard = allCards[Math.floor(Math.random() * allCards.length)];
    }
    
    // Get current transit data for additional context
    const transits = await getCurrentTransits();
    
    // Prepare response
    const cardReading = {
      card: selectedCard,
      isReversed: Math.random() > 0.7, // 30% chance of drawing a reversed card
      moonPhase: transits.moonPhase,
      cosmicContext: `Drawn during ${transits.moonPhase} with ${transits.planets[0].name} in ${transits.planets[0].sign}`
    };
    
    res.status(200).json({
      success: true,
      data: cardReading
    });
  } catch (error) {
    console.error('Pull card error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific tarot card by ID
 */
export const getCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the tarot card
    const card = await prisma.tarotCard.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'This card is not present in our cosmic deck.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get all tarot cards
 */
export const getAllCards = async (req: Request, res: Response) => {
  try {
    // Get all tarot cards
    const cards = await prisma.tarotCard.findMany();
    
    res.status(200).json({
      success: true,
      data: cards
    });
  } catch (error) {
    console.error('Get all cards error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Perform a tarot spread
 */
export const getSpread = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    // Define spread types
    const spreadTypes = {
      'past-present-future': {
        name: 'Past, Present, Future',
        positions: ['Past', 'Present', 'Future'],
        description: 'A simple spread to understand your journey through time.'
      },
      'celtic-cross': {
        name: 'Celtic Cross',
        positions: [
          'Present', 'Challenge', 'Past', 'Future', 
          'Above', 'Below', 'Advice', 'External', 
          'Hopes/Fears', 'Outcome'
        ],
        description: 'A comprehensive spread for deep insight into a situation.'
      },
      'daily': {
        name: 'Daily Guidance',
        positions: ['Guidance for Today'],
        description: 'A simple card to guide you through the day.'
      }
    };
    
    // Determine which spread to use
    const spreadType = type && spreadTypes[String(type)] ? String(type) : 'daily';
    const spread = spreadTypes[spreadType];
    
    // Get all tarot cards
    const allCards = await prisma.tarotCard.findMany();
    
    if (allCards.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'The tarot deck is missing from our cosmic inventory.'
      });
    }
    
    // Draw cards for the spread (ensure no duplicates)
    const drawnCards = [];
    const usedIndices = new Set();
    
    for (let i = 0; i < spread.positions.length; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allCards.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      
      drawnCards.push({
        position: spread.positions[i],
        card: allCards[randomIndex],
        isReversed: Math.random() > 0.7 // 30% chance of drawing a reversed card
      });
    }
    
    // Get current transit data for additional context
    const transits = await getCurrentTransits();
    
    // Prepare response
    const spreadReading = {
      type: spread.name,
      description: spread.description,
      cards: drawnCards,
      moonPhase: transits.moonPhase,
      cosmicContext: `Drawn during ${transits.moonPhase} with ${transits.planets[0].name} in ${transits.planets[0].sign}`
    };
    
    res.status(200).json({
      success: true,
      data: spreadReading
    });
  } catch (error) {
    console.error('Get spread error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
