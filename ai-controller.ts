// src/controllers/soulGuideController.ts
import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { getSoulGuideResponse, analyzeJournal, decodeDream } from '../services/aiService';
import Conversation from '../models/conversation';
import { generateNatalChart } from '../services/astroService';

/**
 * Get a response from the AI Soul Guide
 */
export const getResponse = async (req: Request, res: Response) => {
  try {
    const { mood, question, conversationId } = req.body;
    const userId = req.user?.id;
    
    if (!mood && !question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your mood or a question to guide our cosmic conversation.'
      });
    }
    
    let chartData = null;
    
    // Get user's natal chart data if they're authenticated
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          birthDate: true,
          birthTime: true,
          birthPlace: true
        }
      });
      
      if (user) {
        const birthDate = user.birthDate.toISOString().split('T')[0];
        chartData = await generateNatalChart(birthDate, user.birthTime || '', user.birthPlace || '');
      }
    }
    
    // Get previous messages if conversation ID is provided
    let previousMessages = [];
    if (conversationId && userId) {
      const conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (conversation) {
        previousMessages = conversation.messages.slice(-5); // Get last 5 messages for context
      }
    }
    
    // Generate AI response
    const response = await getSoulGuideResponse({
      mood,
      question,
      chartData,
      previousMessages
    });
    
    // Store conversation if user is authenticated
    if (userId) {
      const newMessage = {
        role: 'user',
        content: question || `Mood: ${mood}`,
        mood,
        timestamp: new Date()
      };
      
      const aiResponse = {
        role: 'soul-guide',
        content: response,
        timestamp: new Date()
      };
      
      if (conversationId) {
        // Add to existing conversation
        await Conversation.findOneAndUpdate(
          { _id: conversationId, userId },
          { 
            $push: { 
              messages: { $each: [newMessage, aiResponse] } 
            },
            updatedAt: new Date()
          }
        );
      } else {
        // Create new conversation
        const newConversation = new Conversation({
          userId,
          title: question?.substring(0, 30) || `Mood: ${mood}`,
          messages: [newMessage, aiResponse]
        });
        
        await newConversation.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        response,
        conversationId: conversationId || null
      }
    });
  } catch (error) {
    console.error('Soul Guide error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all user conversations
    const conversations = await Conversation.find({ 
      userId 
    }).sort({ 
      updatedAt: -1 
    }).limit(10);
    
    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific conversation
 */
export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    // Find the conversation
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId 
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'This cosmic conversation does not exist in your universe.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Analyze journal entry
 */
export const analyzeJournalEntry = async (req: Request, res: Response) => {
  try {
    const { entry } = req.body;
    const userId = req.user.id;
    
    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a journal entry to analyze.'
      });
    }
    
    // Get user's chart data if available
    let chartData = null;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        birthDate: true,
        birthTime: true,
        birthPlace: true
      }
    });
    
    if (user) {
      const birthDate = user.birthDate.toISOString().split('T')[0];
      chartData = await generateNatalChart(birthDate, user.birthTime || '', user.birthPlace || '');
    }
    
    // Analyze the journal entry
    const analysis = await analyzeJournal(entry, chartData);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Journal analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Decode a dream
 */
export const decodeDreamEntry = async (req: Request, res: Response) => {
  try {
    const { dream } = req.body;
    
    if (!dream) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a dream description to decode.'
      });
    }
    
    // Decode the dream
    const interpretation = await decodeDream(dream);
    
    res.status(200).json({
      success: true,
      data: interpretation
    });
  } catch (error) {
    console.error('Dream decoding error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
