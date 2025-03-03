// src/__tests__/setup.ts
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

// Load environment variables from .env.test file if it exists
dotenv.config({ path: '.env.test' });

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '5001';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-unit-testing';
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '32-char-test-key-for-unit-testing!';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/soulsync_test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/soulsync_test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379/1';
process.env.AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Prisma client for tests (will be initialized per test suite)
export const prisma = new PrismaClient();

// Global setup - runs once before all tests
beforeAll(async () => {
  // Connect to MongoDB test database
  await mongoose.connect(process.env.MONGO_URI as string);
});

// Global teardown - runs once after all tests
afterAll(async () => {
  // Disconnect from MongoDB
  await mongoose.connection.close();
  
  // Disconnect from Prisma
  await prisma.$disconnect();
});
