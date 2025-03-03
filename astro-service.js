// src/services/astroService.js
import api from './api';

const astroService = {
  // Get natal chart based on birth details
  getNatalChart: async (birthDate, birthTime, birthPlace) => {
    try {
      const response = await api.get('/astro/chart', {
        params: { birthDate, birthTime, birthPlace }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current transits
  getTransits: async () => {
    try {
      const response = await api.get('/astro/transits');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default astroService;
