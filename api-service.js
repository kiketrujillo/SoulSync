// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 500:
          // Server error
          console.error('The stars are misaligned. Please try again later.');
          break;
        default:
          console.error('Request failed', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
