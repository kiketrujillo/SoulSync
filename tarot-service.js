// src/services/tarotService.js
import api from './api';

const tarotService = {
  // Pull a random tarot card
  pullCard: async () => {
    try {
      const response = await api.get('/tarot/pull');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific card by name or id
  getCard: async (cardId) => {
    try {
      const response = await api.get(`/tarot/card/${cardId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default tarotService;
