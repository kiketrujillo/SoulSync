// src/store/slices/astroSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import astroService from '../../services/astroService';

// Async thunks
export const fetchNatalChart = createAsyncThunk(
  'astro/fetchNatalChart',
  async ({ birthDate, birthTime, birthPlace }, { rejectWithValue }) => {
    try {
      return await astroService.getNatalChart(birthDate, birthTime, birthPlace);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch natal chart');
    }
  }
);

export const fetchTransits = createAsyncThunk(
  'astro/fetchTransits',
  async (_, { rejectWithValue }) => {
    try {
      return await astroService.getTransits();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch transits');
    }
  }
);

const astroSlice = createSlice({
  name: 'astro',
  initialState: {
    natalChart: null,
    transits: null,
    loading: false,
    error: null
  },
  reducers: {
    clearAstroData: (state) => {
      state.natalChart = null;
      state.transits = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Natal chart cases
      .addCase(fetchNatalChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNatalChart.fulfilled, (state, action) => {
        state.natalChart = action.payload;
        state.loading = false;
      })
      .addCase(fetchNatalChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Transits cases
      .addCase(fetchTransits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransits.fulfilled, (state, action) => {
        state.transits = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAstroData } = astroSlice.actions;
export default astroSlice.reducer;
