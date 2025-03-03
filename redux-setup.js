// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tarotReducer from './tarotSlice';
import journalReducer from './journalSlice';
import astroReducer from './astroSlice';
import communityReducer from './communitySlice';
import skillTreeReducer from './skillTreeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tarot: tarotReducer,
    journal: journalReducer,
    astro: astroReducer,
    community: communityReducer,
    skillTree: skillTreeReducer,
  },
});

// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  token: null,
  birthDate: null,
  birthTime: null,
  birthPlace: null,
  zodiacSign: null,
  element: 'water', // default to water element
  mood: null,
  isAuthenticated: false,
  isIncognito: false,
  isOnboarded: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setMood: (state, action) => {
      state.mood = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsIncognito: (state, action) => {
      state.isIncognito = action.payload;
    },
    setIsOnboarded: (state, action) => {
      state.isOnboarded = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setMood, setIsAuthenticated, setIsIncognito, setIsOnboarded, clearUser } = userSlice.actions;

export default userSlice.reducer;

// src/store/astroSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  natalChart: null,
  dailyTransits: null,
  loading: false,
  error: null,
};

export const astroSlice = createSlice({
  name: 'astro',
  initialState,
  reducers: {
    setNatalChart: (state, action) => {
      state.natalChart = action.payload;
    },
    setDailyTransits: (state, action) => {
      state.dailyTransits = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setNatalChart, setDailyTransits, setLoading, setError } = astroSlice.actions;

export default astroSlice.reducer;

// src/store/tarotSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCard: null,
  currentSpread: [],
  history: [],
  loading: false,
};

export const tarotSlice = createSlice({
  name: 'tarot',
  initialState,
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
      state.history.push({ card: action.payload, timestamp: new Date().toISOString() });
    },
    setCurrentSpread: (state, action) => {
      state.currentSpread = action.payload;
      state.history.push({ spread: action.payload, timestamp: new Date().toISOString() });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearCurrentCard: (state) => {
      state.currentCard = null;
    },
    clearCurrentSpread: (state) => {
      state.currentSpread = [];
    },
  },
});

export const { setCurrentCard, setCurrentSpread, setLoading, clearCurrentCard, clearCurrentSpread } = tarotSlice.actions;

export default tarotSlice.reducer;
