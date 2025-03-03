// src/styles/theme.js
export const themes = {
  // Fire Signs (Aries, Leo, Sagittarius)
  fire: {
    primary: '#FF9999',
    secondary: '#FFDAB9',
    accent: '#F4A7A7',
    gradient: 'linear-gradient(to bottom, #FF9999, #FFFFFF)',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF'
    }
  },
  
  // Earth Signs (Taurus, Virgo, Capricorn)
  earth: {
    primary: '#A9BA9D',
    secondary: '#D2B48C',
    accent: '#808000',
    gradient: 'linear-gradient(to bottom, #A9BA9D, #FFFFFF)',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF'
    }
  },
  
  // Air Signs (Gemini, Libra, Aquarius)
  air: {
    primary: '#87CEEB',
    secondary: '#E6E6FA',
    accent: '#98FF98',
    gradient: 'linear-gradient(to bottom, #87CEEB, #FFFFFF)',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF'
    }
  },
  
  // Water Signs (Cancer, Scorpio, Pisces)
  water: {
    primary: '#20B2AA',
    secondary: '#93E9BE',
    accent: '#4B0082',
    gradient: 'linear-gradient(to bottom, #20B2AA, #FFFFFF)',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF'
    }
  }
};

// Map zodiac signs to their elements
export const signToElement = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water'
};

// Get theme based on zodiac sign
export const getThemeBySign = (sign) => {
  const element = signToElement[sign.toLowerCase()] || 'water'; // Default to water
  return themes[element];
};

// Global style constants
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  circle: '50%'
};

export const shadows = {
  soft: '0 4px 8px rgba(0, 0, 0, 0.1)',
  medium: '0 6px 12px rgba(0, 0, 0, 0.15)',
  strong: '0 10px 20px rgba(0, 0, 0, 0.2)',
  glow: '0 0 15px rgba(255, 255, 255, 0.7)'
};
