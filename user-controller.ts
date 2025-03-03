// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { calculateZodiacSign, getZodiacElement } from '../services/astroService';
import { encrypt, decrypt } from '../utils/encrypt';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, birthDate, birthTime, birthPlace, isIncognito } = req.body;
    
    // Validate input
    if (!email || !password || !birthDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields for your cosmic journey.' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already on a spiritual journey with us.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Calculate zodiac sign
    const birthDateObj = new Date(birthDate);
    const zodiacSign = calculateZodiacSign(birthDateObj);
    const element = getZodiacElement(zodiacSign);

    // Encrypt sensitive data if not in incognito mode
    let encryptedBirthPlace = birthPlace;
    if (birthPlace && !isIncognito) {
      encryptedBirthPlace = encrypt(birthPlace);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        birthDate: birthDateObj,
        birthTime: birthTime || null,
        birthPlace: encryptedBirthPlace || null,
        zodiacSign,
        element,
        isIncognito: isIncognito || false
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, isIncognito: user.isIncognito },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user info (excluding password) and token
    res.status(201).json({
      success: true,
      message: 'Your spiritual journey has begun!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          zodiacSign,
          element,
          isIncognito: user.isIncognito,
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'The cosmic energies are turbulent. Please try again later.' 
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, isIncognito } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password to continue your journey.' 
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your soul is not registered with us yet.' 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'The stars do not align with these credentials.' 
      });
    }

    // Update incognito status if requested
    if (isIncognito !== undefined && isIncognito !== user.isIncognito) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isIncognito }
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        isIncognito: isIncognito !== undefined ? isIncognito : user.isIncognito 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user info and token
    res.status(200).json({
      success: true,
      message: 'Welcome back to your spiritual journey!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          zodiacSign: user.zodiacSign,
          element: user.element,
          isIncognito: isIncognito !== undefined ? isIncognito : user.isIncognito
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'The cosmic energies are turbulent. Please try again later.' 
    });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Fetch user data
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: {
        id: true,
        email: true,
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        zodiacSign: true,
        element: true,
        isIncognito: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Your spiritual profile has not been found in our cosmic database.' 
      });
    }

    // Decrypt sensitive data if it exists and user is not in incognito mode
    let birthPlace = user.birthPlace;
    if (birthPlace && !user.isIncognito) {
      try {
        birthPlace = decrypt(birthPlace);
      } catch (error) {
        // If decryption fails, use the encrypted value
        console.error('Decryption error:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...user,
        birthPlace
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'The cosmic energies are turbulent. Please try again later.' 
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { birthTime, birthPlace } = req.body;

    // Don't allow changes to birth date as it affects zodiac calculations
    if (req.body.birthDate) {
      return res.status(400).json({
        success: false,
        message: 'Your birth date is connected to your cosmic signature and cannot be changed.'
      });
    }

    // Encrypt birth place if provided
    let encryptedBirthPlace = birthPlace;
    if (birthPlace && !req.user.isIncognito) {
      encryptedBirthPlace = encrypt(birthPlace);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        birthTime: birthTime || undefined,
        birthPlace: encryptedBirthPlace || undefined
      },
      select: {
        id: true,
        email: true,
        birthDate: true,
        birthTime: true,
        birthPlace: true,
        zodiacSign: true,
        element: true,
        isIncognito: true
      }
    });

    // Decrypt sensitive data for response
    let responseBirthPlace = updatedUser.birthPlace;
    if (responseBirthPlace && !updatedUser.isIncognito) {
      try {
        responseBirthPlace = decrypt(responseBirthPlace);
      } catch (error) {
        console.error('Decryption error:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Your cosmic profile has been updated.',
      data: {
        ...updatedUser,
        birthPlace: responseBirthPlace
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'The cosmic energies are turbulent. Please try again later.' 
    });
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Implement cascading delete or use database triggers/constraints
    // Here we'll handle it manually for better control
    
    // Delete related data in SQL database
    await prisma.$transaction([
      prisma.moonCircleMember.deleteMany({ where: { userId } }),
      prisma.skillTreeProgress.deleteMany({ where: { userId } }),
      prisma.questProgress.deleteMany({ where: { userId } }),
      prisma.altarSetup.deleteMany({ where: { userId } }),
      prisma.journal.deleteMany({ where: { userId } }),
      // Delete user last
      prisma.user.delete({ where: { id: userId } })
    ]);
    
    // Handle MongoDB data deletion (can be moved to a separate function)
    const Journal = require('../models/journal').default;
    const Altar = require('../models/altar').default;
    const Conversation = require('../models/conversation').default;
    
    await Promise.all([
      Journal.deleteMany({ userId }),
      Altar.deleteMany({ userId }),
      Conversation.deleteMany({ userId })
    ]);

    res.status(200).json({
      success: true,
      message: 'Your cosmic journey with us has been concluded. Your data has returned to the universe.'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'The cosmic energies are turbulent. Please try again later.' 
    });
  }
};