// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';
import { logger } from '../utils/logger';

// Redis client configuration with improved error handling
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 2000);
      logger.info(`Redis reconnecting in ${delay}ms (attempt ${retries})`);
      return delay;
    }
  }
});

// Redis event handlers for better observability
redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisClient.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

// Create and export a function to initialize Redis
export const initRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('✨ Redis connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    logger.warn('Falling back to memory store for rate limiting');
    return false;
  }
};

// Create a store function that checks Redis connection state
const getStore = () => {
  if (redisClient.isOpen) {
    return new RedisStore({
      client: redisClient as any,
      prefix: 'soulsync:ratelimit:'
    });
  }
  logger.warn('Using memory store for rate limiting (Redis unavailable)');
  return undefined; // Falls back to memory store
};

// Create rate limiter that uses Redis if available, memory store if not
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'The cosmic energies are flowing too quickly. Please slow down your requests.'
  },
  // Store will be set when middleware is used
  skip: (req, res) => req.path === '/api/health', // Skip rate limiting for health checks
});

// More strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after a cosmic alignment (15 minutes).'
  }
});

// Limiter for non-critical endpoints like content fetching
export const contentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'The cosmic library is busy. Please slow down your requests.'
  }
});

// Function to update the store if Redis becomes available
export const updateRateLimitStores = () => {
  if (redisClient.isOpen) {
    const store = getStore();
    apiLimiter.store = store;
    authLimiter.store = store;
    contentLimiter.store = store;
    logger.info('Rate limiter stores updated to use Redis');
  }
};

// Export Redis client for use elsewhere
export { redisClient };
