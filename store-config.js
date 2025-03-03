// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import astroReducer from './slices/astroSlice';
import tarotReducer from './slices/tarotSlice';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    user: userReducer,
    astro: astroReducer,
    tarot: tarotReducer,
    // Add other reducers here
  }
});

export default store;
