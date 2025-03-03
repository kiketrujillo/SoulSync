// src/store/slices/tarotSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tarotService from '../../services/tarotService';

// Async thunks
export const pullTarotCard = createAsyncThunk(
  'tarot/pullCard',
  async (_, { rejectWithValue }) => {
    try {
      return await tarotService.pullCard();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to pull tarot card');
    }
  }
);

export const fetchTarotCard = createAsyncThunk(
  'tarot/fetchCard',
  async (cardId, { rejectWithValue }) => {
    try {
      return await tarotService.getCard(cardId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tarot card');
    }
  }
);

const tarotSlice = createSlice({
  name: 'tarot',
  initialState: {
    currentCard: null,
    cardHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentCard: (state) => {
      state.currentCard = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pull card cases
      .addCase(pullTarotCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pullTarotCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
        state.cardHistory.push({
          ...action.payload,
          pulledAt: new Date().toISOString()
        });
        state.loading = false;
      })
      .addCase(pullTarotCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch specific card cases
      .addCase(fetchTarotCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTarotCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
        state.loading = false;
      })
      .addCase(fetchTarotCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentCard } = tarotSlice.actions;
export default tarotSlice.reducer;
