// src/utils/validateEnv.ts
import { logger } from './logger';

/**
 * Required environment variables
 */
const REQUIRED_VARS = [
  'PORT',
  'DATABASE_URL',
  'MONGO_URI',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'AI_SERVICE_URL'
];

/**
 * Optional environment variables with default values
 */
const OPTIONAL_VARS: Record<string, string> = {
  'NODE_ENV': 'development',
  'FRONTEND_URL': 'http://localhost:3000',
  'JWT_EXPIRES_IN': '24h',
  'REDIS_URL': 'redis://localhost:6379'
};

/**
 * Validate that required environment variables are set
 */
export const validateEnvironment = (): void => {
  logger.info('Validating environment variables...');
  
  const missing: string[] = [];
  
  // Check required variables
  for (const envVar of REQUIRED_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  // Set defaults for optional variables
  for (const [envVar, defaultValue] of Object.entries(OPTIONAL_VARS)) {
    if (!process.env[envVar]) {
      process.env[envVar] = defaultValue;
      logger.info(`Setting default for ${envVar}: ${defaultValue}`);
    }
  }
  
  // Log validation results
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate specific variables
  validateJwtSecret();
  validateEncryptionKey();
  validateDatabaseUrls();
  
  logger.info('Environment validation completed successfully');
};

/**
 * Validate JWT secret meets security requirements
 */
const validateJwtSecret = (): void => {
  const jwtSecret = process.env.JWT_SECRET!;
  
  if (jwtSecret.length < 32) {
    logger.warn('JWT_SECRET is less than 32 characters. This is a security risk.');
  }
  
  if (jwtSecret === 'your-secret-key' || jwtSecret === 'your-secret-key-change-in-production') {
    logger.error('JWT_SECRET is using the default value. This is a serious security risk in production!');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is using the default value in production environment');
    }
  }
};

/**
 * Validate encryption key meets security requirements
 */
const validateEncryptionKey = (): void => {
  const encryptionKey = process.env.ENCRYPTION_KEY!;
  
  if (encryptionKey.length !== 32) {
    logger.error('ENCRYPTION_KEY must be exactly 32 characters for AES-256');
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters for AES-256');
  }
  
  if (encryptionKey === '32-character-secure-key-for-aes256' || 
      encryptionKey === '32-char-long-key-here-1234567890') {
    logger.error('ENCRYPTION_KEY is using the default value. This is a serious security risk!');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY is using the default value in production environment');
    }
  }
};

/**
 * Validate database connection URLs
 */
const validateDatabaseUrls = (): void => {
  const databaseUrl = process.env.DATABASE_URL!;
  const mongoUri = process.env.MONGO_URI!;
  
  // Validate PostgreSQL URL
  if (!databaseUrl.startsWith('postgresql://')) {
    logger.error('DATABASE_URL must be a valid PostgreSQL connection string');
    throw new Error('Invalid DATABASE_URL format');
  }
  
  // Validate MongoDB URI
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    logger.error('MONGO_URI must be a valid MongoDB connection string');
    throw new Error('Invalid MONGO_URI format');
  }
};
