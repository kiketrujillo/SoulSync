// src/services/journalService.js
import api from './api';

const journalService = {
  // Save a journal entry
  saveEntry: async (entryData) => {
    try {
      const response = await api.post('/journal', entryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all journal entries
  getEntries: async () => {
    try {
      const response = await api.get('/journal');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific journal entry
  getEntry: async (entryId) => {
    try {
      const response = await api.get(`/journal/${entryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Analyze a dream or journal entry
  analyzeEntry: async (entryId) => {
    try {
      const response = await api.get(`/journal/decode/${entryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default journalService;
