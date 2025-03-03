// src/services/aiService.ts
import axios from 'axios';
import { getCurrentTransits } from './astroService';

/**
 * Interface for AI input data
 */
interface SoulGuideInput {
  mood?: string;
  question?: string;
  chartData?: any;
  tarotCards?: any[];
  previousMessages?: any[];
}

/**
 * Generate AI Soul Guide response
 */
export const getSoulGuideResponse = async (input: SoulGuideInput): Promise<string> => {
  try {
    // Add current transits to enhance the context
    const currentTransits = await getCurrentTransits();
    
    // Prepare context for AI
    const context = {
      ...input,
      transits: currentTransits
    };
    
    // Call the AI service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate`,
      { input: JSON.stringify(context) },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    return response.data.response;
  } catch (error) {
    console.error('AI service error:', error);
    // Fallback responses if AI service is unavailable
    const fallbackResponses = [
      "The cosmic energies are particularly strong right now. Take a moment to breathe and center yourself.",
      "I sense a shift in the universe's alignment. This is a good time for reflection and inner work.",
      "The stars suggest patience at this moment. Allow yourself space to process your feelings.",
      "Your spiritual journey is unique and valuable. Trust your inner wisdom to guide you.",
      "The celestial bodies are moving in interesting patterns. Stay open to unexpected insights.",
      "This period holds potential for growth. What seeds are you planting in your spiritual garden?",
      "The universe has a way of aligning just when we need it most. Trust the timing of your journey."
    ];
    
    // Return a random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

/**
 * Process journal entry for spiritual insights
 */
export const analyzeJournal = async (entry: string, chartData?: any): Promise<any> => {
  try {
    // In a production app, this would call a specialized AI model
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze-journal`,
      { 
        entry,
        chartData: chartData || await getCurrentTransits()
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Journal analysis error:', error);
    // Return basic analysis if AI service fails
    return {
      themes: ["reflection", "growth"],
      cosmicInsights: [
        {
          planet: "Mercury",
          aspect: "Reflection",
          interpretation: "Your thoughts are seeking clarity during this time."
        }
      ],
      guidance: "Your journal reveals a thoughtful period of self-discovery. Continue to explore these themes as the cosmos supports your inner work."
    };
  }
};

/**
 * Decode dreams with AI
 */
export const decodeDream = async (dreamDescription: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/decode-dream`,
      { dreamDescription },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Dream decoding error:', error);
    // Return basic dream interpretation if AI service fails
    return {
      symbols: [
        { element: "water", meaning: "emotions and the unconscious" },
        { element: "flying", meaning: "freedom and transcendence" }
      ],
      archetypes: ["The Explorer", "The Sage"],
      guidance: "Your dream suggests a journey through emotional depths, seeking wisdom and liberation. Pay attention to your intuition in the coming days."
    };
  }
};
