// src/__tests__/controllers/userController.test.ts
import request from 'supertest';
import app from '../../app';
import { prisma } from '../setup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('User Controller', () => {
  // Clear user data before each test
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthPlace: 'New York, NY'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('spiritual journey');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();

      // Verify the user was created in the database
      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
    });

    it('should return an error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          // Missing password and birthDate
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required fields');
    });

    it('should return an error for existing email', async () => {
      // Create a user first
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: await bcrypt.hash('Password123!', 10),
          birthDate: new Date('1990-01-01'),
          zodiacSign: 'Capricorn',
          element: 'Earth'
        }
      });

      // Try to register with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'NewPassword123!',
          birthDate: '1991-01-01',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already on a spiritual journey');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await prisma.user.create({
        data: {
          email: 'login@example.com',
          password: await bcrypt.hash('Password123!', 10),
          birthDate: new Date('1990-01-01'),
          zodiacSign: 'Capricorn',
          element: 'Earth'
        }
      });
    });

    it('should login a user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Welcome back');
      expect(response.body.data.token).toBeDefined();

      // Verify token
      const decodedToken = jwt.verify(
        response.body.data.token,
        process.env.JWT_SECRET || 'test-jwt-secret-key-for-unit-testing'
      ) as any;
      
      expect(decodedToken).toHaveProperty('id');
      expect(decodedToken.email).toBe('login@example.com');
    });

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('stars do not align');
    });
  });

  describe('GET /api/auth/profile', () => {
    let token: string;
    let userId: number;

    beforeEach(async () => {
      // Create a test user
      const user = await prisma.user.create({
        data: {
          email: 'profile@example.com',
          password: await bcrypt.hash('Password123!', 10),
          birthDate: new Date('1990-01-01'),
          birthTime: '12:00',
          birthPlace: 'encrypt(New York, NY)', // Simulate encrypted data
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
    });

    it('should get the user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', userId);
      expect(response.body.data.email).toBe('profile@example.com');
      expect(response.body.data).toHaveProperty('birthDate');
      expect(response.body.data).toHaveProperty('zodiacSign', 'Capricorn');
    });

    it('should return an error when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });
  });
});
