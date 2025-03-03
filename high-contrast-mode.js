// src/styles/highContrastTheme.js
export const highContrastThemes = {
  // Fire Signs (Aries, Leo, Sagittarius)
  fire: {
    primary: '#FF5500',
    secondary: '#FFCC00',
    accent: '#FF0000',
    gradient: 'linear-gradient(to bottom, #000000, #330000)',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      light: '#FFFFFF'
    }
  },
  
  // Earth Signs (Taurus, Virgo, Capricorn)
  earth: {
    primary: '#00CC00',
    secondary: '#FFCC00',
    accent: '#006600',
    gradient: 'linear-gradient(to bottom, #000000, #003300)',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      light: '#FFFFFF'
    }
  },
  
  // Air Signs (Gemini, Libra, Aquarius)
  air: {
    primary: '#00CCFF',
    secondary: '#FFFFFF',
    accent: '#0099FF',
    gradient: 'linear-gradient(to bottom, #000000, #000066)',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      light: '#FFFFFF'
    }
  },
  
  // Water Signs (Cancer, Scorpio, Pisces)
  water: {
    primary: '#00FFFF',
    secondary: '#0099CC',
    accent: '#CC00FF',
    gradient: 'linear-gradient(to bottom, #000000, #000066)',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      light: '#FFFFFF'
    }
  }
};

// Global style constants for high contrast
export const highContrastSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

export const highContrastBorderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  circle: '50%'
};

export const highContrastShadows = {
  soft: '0 0 0 2px #FFFFFF',
  medium: '0 0 0 3px #FFFFFF',
  strong: '0 0 0 4px #FFFFFF',
  glow: '0 0 15px rgba(255, 255, 255, 0.9)'
};