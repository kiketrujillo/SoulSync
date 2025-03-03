// src/App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Store
import { store } from './store';
import { setUser } from './store/userSlice';

// Themes
import { themes, signToElement, getThemeBySign } from './styles/theme';
import { highContrastThemes } from './styles/highContrastTheme';
import GlobalStyle from './styles/global';

// Screens
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import SoulMap from './screens/SoulMap';
import VirtualAltar from './screens/VirtualAltar';
import Journal from './screens/Journal';
import SkillTree from './screens/SkillTree';
import Community from './screens/Community';
import WellnessQuests from './screens/WellnessQuests';
import UserSettings from './screens/UserSettings';

// Components
import Navigation from './components/Navigation';

const AppContent = () => {
  const { isOnboarded, zodiacSign } = useSelector(state => state.user);
  const [activeTheme, setActiveTheme] = useState(themes.water); // Default theme
  const [isHighContrast, setIsHighContrast] = useState(false);
  const location = useLocation();
  
  // Update theme when zodiac sign changes
  useEffect(() => {
    if (zodiacSign) {
      const element = signToElement[zodiacSign.toLowerCase()] || 'water';
      setActiveTheme(isHighContrast ? highContrastThemes[element] : themes[element]);
    }
  }, [zodiacSign, isHighContrast]);
  
  // Check for high contrast mode preference
  useEffect(() => {
    const savedHighContrastMode = localStorage.getItem('highContrastMode');
    if (savedHighContrastMode) {
      const isHighContrastEnabled = JSON.parse(savedHighContrastMode);
      setIsHighContrast(isHighContrastEnabled);
      
      if (isHighContrastEnabled && zodiacSign) {
        const element = signToElement[zodiacSign.toLowerCase()] || 'water';
        setActiveTheme(highContrastThemes[element]);
      }
    }
  }, [zodiacSign]);
  
  if (!isOnboarded) {
    return (
      <ThemeProvider theme={activeTheme}>
        <GlobalStyle />
        <Onboarding />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyle />
      <div style={{ paddingBottom: '70px' }}> {/* Space for navigation */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/soul-map" element={<SoulMap />} />
          <Route path="/virtual-altar" element={<VirtualAltar />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/skill-tree" element={<SkillTree />} />
          <Route path="/community" element={<Community />} />
          <Route path="/quests" element={<WellnessQuests />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      {location.pathname !== '/onboarding' && <Navigation />}
    </ThemeProvider>
  );
};

const App = () => {
  // In a real app, we'd check for saved user data in local storage here
  // and initialize the auth state accordingly
  
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
