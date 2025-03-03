// src/controllers/healthController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { redisClient } from '../middleware/rateLimit';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Health check endpoint to verify system status
 */
export const healthCheck = async (req: Request, res: Response) => {
  const response = {
    status: 'ok',
    timestamp: new Date(),
    services: {
      api: { status: 'ok' },
      postgresql: { status: 'pending' },
      mongodb: { status: 'pending' },
      redis: { status: 'pending' },
      ai_service: { status: 'pending' }
    },
    uptime: process.uptime()
  };

  try {
    // Check PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    response.services.postgresql.status = 'ok';
  } catch (error) {
    logger.error('PostgreSQL health check failed:', error);
    response.services.postgresql.status = 'error';
    response.status = 'degraded';
  }

  // Check MongoDB connection
  if (mongoose.connection.readyState === 1) {
    response.services.mongodb.status = 'ok';
  } else {
    logger.error('MongoDB health check failed. Connection state:', mongoose.connection.readyState);
    response.services.mongodb.status = 'error';
    response.status = 'degraded';
  }

  // Check Redis connection
  if (redisClient.isOpen) {
    try {
      await redisClient.ping();
      response.services.redis.status = 'ok';
    } catch (error) {
      logger.error('Redis health check failed:', error);
      response.services.redis.status = 'error';
      response.status = 'degraded';
    }
  } else {
    response.services.redis.status = 'error';
    response.status = 'degraded';
  }

  // Check AI service connection
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const aiResponse = await fetch(`${aiServiceUrl}/`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (aiResponse.ok) {
      response.services.ai_service.status = 'ok';
    } else {
      logger.error('AI service health check failed. Status:', aiResponse.status);
      response.services.ai_service.status = 'error';
      response.status = 'degraded';
    }
  } catch (error) {
    logger.error('AI service health check failed:', error);
    response.services.ai_service.status = 'error';
    response.status = 'degraded';
  }

  // Send response with appropriate status code
  const statusCode = response.status === 'ok' ? 200 : 
                     response.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(response);
};

/**
 * Simple ready check for load balancers
 */
export const readyCheck = (req: Request, res: Response) => {
  res.status(200).send('OK');
};
