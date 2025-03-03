// src/components/auth/ProtectedRoute.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchProfile } from '../../store/slices/userSlice';
import authService from '../../services/authService';

// This component wraps routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, profile } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no profile, fetch the profile
    if (authService.isAuthenticated() && !profile && !loading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile, loading]);

  // If no token exists, redirect to login
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-screen">Connecting to the stars...</div>;
  }

  // If authenticated, render the protected route
  return children;
};

export default ProtectedRoute;
