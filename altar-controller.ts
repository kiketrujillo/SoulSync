// src/controllers/altarController.ts
import { Request, Response } from 'express';
import Altar from '../models/altar';
import { getCurrentTransits } from '../services/astroService';

/**
 * Create a new altar setup
 */
export const createAltar = async (req: Request, res: Response) => {
  try {
    const { name, items, intentions, theme, backgroundImage } = req.body;
    const userId = req.user.id;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one sacred item to your altar.'
      });
    }
    
    // Get current cosmic context
    const transits = await getCurrentTransits();
    
    // Create the new altar
    const newAltar = new Altar({
      userId,
      name: name || 'My Sacred Space',
      items,
      intentions: intentions || [],
      theme: theme || 'default',
      backgroundImage,
      createdAt: new Date(),
      cosmicContext: {
        moonPhase: transits.moonPhase,
        significantPlanet: transits.planets[0].name,
        planetSign: transits.planets[0].sign
      }
    });
    
    await newAltar.save();
    
    res.status(201).json({
      success: true,
      message: 'Your sacred space has been created.',
      data: newAltar
    });
  } catch (error) {
    console.error('Create altar error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get all altar setups for a user
 */
export const getAltars = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Find all altars for this user
    const altars = await Altar.find({ userId }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      data: altars
    });
  } catch (error) {
    console.error('Get altars error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Get a specific altar setup
 */
export const getAltar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find the altar
    const altar = await Altar.findOne({ _id: id, userId });
    
    if (!altar) {
      return res.status(404).json({
        success: false,
        message: 'This sacred space does not exist in your cosmic inventory.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: altar
    });
  } catch (error) {
    console.error('Get altar error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Update an altar setup
 */
export const updateAltar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, items, intentions, theme, backgroundImage } = req.body;
    const userId = req.user.id;
    
    // Find the altar
    const altar = await Altar.findOne({ _id: id, userId });
    
    if (!altar) {
      return res.status(404).json({
        success: false,
        message: 'This sacred space does not exist in your cosmic inventory.'
      });
    }
    
    // Update fields
    if (name) altar.name = name;
    if (items && Array.isArray(items) && items.length > 0) altar.items = items;
    if (intentions) altar.intentions = intentions;
    if (theme) altar.theme = theme;
    if (backgroundImage) altar.backgroundImage = backgroundImage;
    
    // Update energy level based on moon phase
    const transits = await getCurrentTransits();
    let energyBoost = 0;
    
    // Boost energy during Full Moon, diminish during New Moon
    if (transits.moonPhase === 'Full Moon') {
      energyBoost = 20;
    } else if (transits.moonPhase === 'New Moon') {
      energyBoost = -10;
    }
    
    // Update energy level (capped between 0 and 100)
    altar.energyLevel = Math.min(100, Math.max(0, altar.energyLevel + energyBoost));
    
    // Update timestamp
    altar.updatedAt = new Date();
    
    await altar.save();
    
    res.status(200).json({
      success: true,
      message: 'Your sacred space has been updated.',
      data: altar
    });
  } catch (error) {
    console.error('Update altar error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Add an item to an altar
 */
export const addItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    const userId = req.user.id;
    
    if (!item || !item.type || !item.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid item details for your sacred space.'
      });
    }
    
    // Find the altar
    const altar = await Altar.findOne({ _id: id, userId });
    
    if (!altar) {
      return res.status(404).json({
        success: false,
        message: 'This sacred space does not exist in your cosmic inventory.'
      });
    }
    
    // Add the item
    altar.items.push(item);
    
    // Update timestamp
    altar.updatedAt = new Date();
    
    await altar.save();
    
    res.status(200).json({
      success: true,
      message: `The ${item.name} has been added to your sacred space.`,
      data: altar
    });
  } catch (error) {
    console.error('Add altar item error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Remove an item from an altar
 */
export const removeItem = async (req: Request, res: Response) => {
  try {
    const { id, itemIndex } = req.params;
    const userId = req.user.id;
    
    // Find the altar
    const altar = await Altar.findOne({ _id: id, userId });
    
    if (!altar) {
      return res.status(404).json({
        success: false,
        message: 'This sacred space does not exist in your cosmic inventory.'
      });
    }
    
    const index = parseInt(itemIndex);
    
    if (isNaN(index) || index < 0 || index >= altar.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item index for your sacred space.'
      });
    }
    
    // Get the item name before removing
    const itemName = altar.items[index].name;
    
    // Remove the item
    altar.items.splice(index, 1);
    
    // Update timestamp
    altar.updatedAt = new Date();
    
    await altar.save();
    
    res.status(200).json({
      success: true,
      message: `The ${itemName} has been removed from your sacred space.`,
      data: altar
    });
  } catch (error) {
    console.error('Remove altar item error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};

/**
 * Delete an altar setup
 */
export const deleteAltar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find and delete the altar
    const result = await Altar.deleteOne({ _id: id, userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'This sacred space does not exist in your cosmic inventory.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Your sacred space has been dismantled and released back to the universe.'
    });
  } catch (error) {
    console.error('Delete altar error:', error);
    res.status(500).json({
      success: false,
      message: 'The cosmic energies are turbulent. Please try again later.'
    });
  }
};
