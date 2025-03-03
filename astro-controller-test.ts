// src/__tests__/controllers/astroController.test.ts
import request from 'supertest';
import app from '../../app';
import { prisma } from '../setup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as astroService from '../../services/astroService';

// Mock astrology service functions
jest.mock('../../services/astroService', () => ({
  generateNatalChart: jest.fn(),
  getCurrentTransits: jest.fn(),
  mapToKabbalah: jest.fn(),
  getPersonalizedTransits: jest.fn(),
  calculateZodiacSign: jest.fn(),
  getZodiacElement: jest.fn(),
}));

describe('Astrology Controller', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'astro@example.com',
        password: await bcrypt.hash('Password123!', 10),
        birthDate: new Date('1990-01-01'),
        birthTime: '12:00',
        birthPlace: 'New York, NY',
        zodiacSign: 'Capricorn',
        element: 'Earth'
      }
    });
    
    userId = user.id;
    
    // Generate JWT token
    token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'test-jwt-secret-key-for-unit-testing',
      { expiresIn: '1h' }
    );

    // Mock service functions
    (astroService.generateNatalChart as jest.Mock).mockResolvedValue({
      planets: [
        { name: 'Sun', sign: 'Capricorn', house: 1, degree: 10 },
        { name: 'Moon', sign: 'Taurus', house: 5, degree: 15 }
      ],
      houses: [
        { number: 1, sign: 'Capricorn', degree: 0 },
        { number: 2, sign: 'Aquarius', degree: 0 }
      ]
    });

    (astroService.getCurrentTransits as jest.Mock).mockResolvedValue({
      date: new Date().toISOString(),
      moonPhase: 'Waxing Gibbous',
      planets: [
        { name: 'Sun', sign: 'Aries', degree: 15 },
        { name: 'Moon', sign: 'Cancer', degree: 10 }
      ]
    });

    (astroService.mapToKabbalah as jest.Mock).mockImplementation(planets => 
      planets.map(planet => ({
        ...planet,
        sephirot: planet.name === 'Sun' ? 'Tiphareth' : 'Yesod'
      }))
    );

    (astroService.getPersonalizedTransits as jest.Mock).mockResolvedValue([
      {
        transit: 'Sun',
        natal: 'Moon',
        aspect: 'Trine',
        interpretation: 'A harmonious time for emotional expression.'
      }
    ]);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
  });

  describe('GET /api/astro/chart', () => {
    it('should return a natal chart for an authenticated user', async () => {
      const response = await request(app)
        .get('/api/astro/chart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('planets');
      expect(response.body.data).toHaveProperty('houses');
      expect(response.body.data.planets[0]).toHaveProperty('sephirot'); // Kabbalistic mapping
      
      // Verify service was called
      expect(astroService.generateNatalChart).toHaveBeenCalled();
      expect(astroService.mapToKabbalah).toHaveBeenCalled();
    });

    it('should return an error for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/astro/chart')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('GET /api/astro/transits', () => {
    it('should return current transits', async () => {
      const response = await request(app)
        .get('/api/astro/transits')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('moonPhase');
      expect(response.body.data).toHaveProperty('planets');
      expect(response.body.data.planets[0]).toHaveProperty('sephirot'); // Kabbalistic mapping
      
      // Verify service was called
      expect(astroService.getCurrentTransits).toHaveBeenCalled();
      expect(astroService.mapToKabbalah).toHaveBeenCalled();
    });
  });

  describe('GET /api/astro/insights', () => {
    it('should return personalized transit insights for authenticated user', async () => {
      const response = await request(app)
        .get('/api/astro/insights')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('insights');
      expect(response.body.data).toHaveProperty('moonPhase');
      expect(response.body.data.insights).toBeInstanceOf(Array);
      
      // Verify services were called
      expect(astroService.generateNatalChart).toHaveBeenCalled();
      expect(astroService.getCurrentTransits).toHaveBeenCalled();
      expect(astroService.getPersonalizedTransits).toHaveBeenCalled();
    });

    it('should return an error for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/astro/insights')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('GET /api/astro/calendar', () => {
    it('should return cosmic calendar of upcoming events', async () => {
      const response = await request(app)
        .get('/api/astro/calendar')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check structure of first event
      const firstEvent = response.body.data[0];
      expect(firstEvent).toHaveProperty('date');
      expect(firstEvent).toHaveProperty('type');
      expect(firstEvent).toHaveProperty('description');
      expect(firstEvent).toHaveProperty('element');
      expect(firstEvent).toHaveProperty('ritualSuggestion');
    });
  });
});
