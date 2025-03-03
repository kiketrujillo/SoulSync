// src/services/soulGuideService.js
import api from './api';

const soulGuideService = {
  // Get a response from the AI Soul Guide
  getResponse: async (mood, question) => {
    try {
      const response = await api.post('/soul-guide', { mood, question });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default soulGuideService;
