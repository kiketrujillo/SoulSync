// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✨ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    // Continue without Redis - will use memory store as fallback
  }
})();

// Create rate limiter that uses Redis if available, memory store if not
export const apiLimiter = rateLimit({
  store: redisClient.isOpen 
    ? new RedisStore({
        client: redisClient as any,
        prefix: 'soulsync:ratelimit:'
      }) 
    : undefined, // Falls back to memory store
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'The cosmic energies are flowing too quickly. Please slow down your requests.'
  }
});

// More strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  store: redisClient.isOpen 
    ? new RedisStore({
        client: redisClient as any,
        prefix: 'soulsync:authlimit:'
      }) 
    : undefined, // Falls back to memory store
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
  store: redisClient.isOpen 
    ? new RedisStore({
        client: redisClient as any,
        prefix: 'soulsync:contentlimit:'
      }) 
    : undefined, // Falls back to memory store
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'The cosmic library is busy. Please slow down your requests.'
  }
});
