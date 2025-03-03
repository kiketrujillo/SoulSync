// src/services/astroService.ts
import axios from 'axios';

/**
 * Calculate zodiac sign based on birth date
 */
export const calculateZodiacSign = (birthDate: Date): string => {
  const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
  const day = birthDate.getDate();

  // Define zodiac sign date ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces'; // Feb 19 - Mar 20
};

/**
 * Get zodiac element based on sign
 */
export const getZodiacElement = (sign: string): string => {
  const fireSign = ['Aries', 'Leo', 'Sagittarius'];
  const earthSign = ['Taurus', 'Virgo', 'Capricorn'];
  const airSign = ['Gemini', 'Libra', 'Aquarius'];
  const waterSign = ['Cancer', 'Scorpio', 'Pisces'];

  if (fireSign.includes(sign)) return 'Fire';
  if (earthSign.includes(sign)) return 'Earth';
  if (airSign.includes(sign)) return 'Air';
  if (waterSign.includes(sign)) return 'Water';
  
  return 'Unknown';
};

/**
 * Generate a natal chart
 */
export const generateNatalChart = async (birthDate: string, birthTime: string, birthPlace: string) => {
  try {
    // In a real application, you would use a proper astrology API or library
    // This is a placeholder for demonstration purposes
    const chartData = await axios.get(
      `${process.env.ASTRO_API_URL}/chart`,
      {
        params: { date: birthDate, time: birthTime, place: birthPlace },
        headers: { 'X-API-Key': process.env.ASTRO_API_KEY }
      }
    );
    
    return chartData.data;
  } catch (error) {
    console.error('Error generating natal chart:', error);
    
    // Return sample data if API fails
    return {
      planets: [
        { name: 'Sun', sign: 'Libra', house: 7, degree: 15 },
        { name: 'Moon', sign: 'Cancer', house: 4, degree: 23 },
        { name: 'Mercury', sign: 'Virgo', house: 6, degree: 8 },
        // More planets would be included here
      ],
      houses: [
        { number: 1, sign: 'Aries', degree: 5 },
        { number: 2, sign: 'Taurus', degree: 2 },
        // More houses would be included here
      ],
      aspects: [
        { planet1: 'Sun', planet2: 'Moon', type: 'Square', orb: 2.5 },
        // More aspects would be included here
      ]
    };
  }
};

/**
 * Get current transits
 */
export const getCurrentTransits = async () => {
  try {
    // In a real application, you would use a proper astrology API or library
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    const transitsData = await axios.get(
      `${process.env.ASTRO_API_URL}/transits`,
      {
        params: { date: currentDate },
        headers: { 'X-API-Key': process.env.ASTRO_API_KEY }
      }
    );
    
    return transitsData.data;
  } catch (error) {
    console.error('Error getting current transits:', error);
    
    // Return sample data if API fails
    return {
      date: new Date().toISOString(),
      planets: [
        { name: 'Sun', sign: 'Scorpio', degree: 10 },
        { name: 'Moon', sign: 'Gemini', degree: 5 },
        { name: 'Mercury', sign: 'Scorpio', degree: 15 },
        // More planets would be included here
      ],
      aspects: [
        { planet1: 'Sun', planet2: 'Pluto', type: 'Conjunction', orb: 1.2 },
        // More aspects would be included here
      ],
      moonPhase: 'Waxing Gibbous',
      significantEvents: [
        { name: 'Mercury Retrograde', description: 'Communication challenges' },
        // More events would be included here
      ]
    };
  }
};

/**
 * Map astrological data to Kabbalah
 */
export const mapToKabbalah = (planets: any[]) => {
  // Mapping of planets to Sephirot on the Tree of Life
  const planetToSephirot = {
    'Sun': 'Tiphareth',
    'Moon': 'Yesod',
    'Mercury': 'Hod',
    'Venus': 'Netzach',
    'Mars': 'Geburah',
    'Jupiter': 'Chesed',
    'Saturn': 'Binah',
    'Uranus': 'Chokmah',
    'Neptune': 'Kether',
    'Pluto': 'Malkuth'
  };
  
  return planets.map(planet => ({
    ...planet,
    sephirot: planetToSephirot[planet.name] || 'Unknown',
    // Additional Kabbalistic correspondences could be added here
  }));
};

/**
 * Generate personalized transit insights based on natal chart
 */
export const getPersonalizedTransits = async (natalChart: any, currentTransits: any) => {
  // In a real application, this would be much more sophisticated
  // This is a simplified example
  
  const insights = [];
  
  // Compare each transit planet to natal planets
  for (const transitPlanet of currentTransits.planets) {
    for (const natalPlanet of natalChart.planets) {
      // Calculate aspect (extremely simplified here)
      const degreeDifference = Math.abs(transitPlanet.degree - natalPlanet.degree);
      let aspect = null;
      
      if (degreeDifference < 10) aspect = 'Conjunction';
      else if (Math.abs(degreeDifference - 60) < 10) aspect = 'Sextile';
      else if (Math.abs(degreeDifference - 90) < 10) aspect = 'Square';
      else if (Math.abs(degreeDifference - 120) < 10) aspect = 'Trine';
      else if (Math.abs(degreeDifference - 180) < 10) aspect = 'Opposition';
      
      if (aspect) {
        insights.push({
          transit: transitPlanet.name,
          natal: natalPlanet.name,
          aspect,
          interpretation: generateInterpretation(transitPlanet.name, natalPlanet.name, aspect)
        });
      }
    }
  }
  
  return insights;
};

/**
 * Generate interpretation for a specific aspect
 */
const generateInterpretation = (transitPlanet: string, natalPlanet: string, aspect: string): string => {
  // In a real application, this would use a database of interpretations or AI
  // This is a simplified example with a few templates
  
  const interpretations = {
    'Sun-Moon-Conjunction': 'A time of emotional alignment. Your conscious goals and emotional needs are in harmony.',
    'Moon-Venus-Trine': 'A beautiful time for relationships. Express your feelings to loved ones.',
    'Mars-Saturn-Square': 'You may feel frustrated by obstacles. Patience and perseverance are key.',
    'Jupiter-Sun-Trine': 'An expansive period for your self-expression. Confidence is high.',
    'Mercury-Mercury-Conjunction': 'Communication is highlighted. A good time for important conversations.',
    // Default templates for common scenarios
    'default-Conjunction': 'A powerful alignment that intensifies the energies involved.',
    'default-Square': 'A challenging aspect that creates tension and calls for growth.',
    'default-Trine': 'A harmonious flow of energy that brings ease and opportunity.',
    'default-Opposition': 'A balancing act between opposing forces in your life.',
    'default-Sextile': 'A gentle opportunity that can be leveraged with awareness.'
  };
  
  const key = `${transitPlanet}-${natalPlanet}-${aspect}`;
  
  return interpretations[key] || interpretations[`default-${aspect}`] || 
    `${transitPlanet} is forming a ${aspect} to your natal ${natalPlanet}, bringing its energy into your cosmic experience.`;
};
