// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/userSlice';
import authService from './services/authService';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import SoulMap from './components/soulmap/SoulMap';
import MoonCircle from './components/community/MoonCircle';
import JournalPage from './components/journal/JournalPage';
import VirtualAltar from './components/altar/VirtualAltar';
import SkillTree from './components/skills/SkillTree';

// Socket service for real-time connections
import socketService from './services/socketService';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      dispatch(fetchProfile());
      
      // Connect to socket for real-time features
      socketService.connect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/soulmap" element={
          <ProtectedRoute>
            <SoulMap />
          </ProtectedRoute>
        } />
        
        <Route path="/journal" element={
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        } />
        
        <Route path="/altar" element={
          <ProtectedRoute>
            <VirtualAltar />
          </ProtectedRoute>
        } />
        
        <Route path="/skills" element={
          <ProtectedRoute>
            <SkillTree />
          </ProtectedRoute>
        } />
        
        <Route path="/circle/:circleId" element={
          <ProtectedRoute>
            <MoonCircle />
          </ProtectedRoute>
        } />
        
        {/* Redirect root to dashboard if authenticated, otherwise to login */}
        <Route path="/" element={
          authService.isAuthenticated() 
            ? <Navigate to="/dashboard" replace /> 
            : <Navigate to="/login" replace />
        } />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<div>Page not found in this dimension</div>} />
      </Routes>
    </Router>
  );
};

export default App;
