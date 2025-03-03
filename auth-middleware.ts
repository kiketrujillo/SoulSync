// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Get token from headers, query, or cookies
  const token = 
    req.headers.authorization?.split(' ')[1] || 
    req.query.token?.toString() || 
    req.cookies?.token;

  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token. Your cosmic connection has expired.' 
    });
  }
};

/**
 * Optional authentication - doesn't require auth but will use it if available
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = 
    req.headers.authorization?.split(' ')[1] || 
    req.query.token?.toString() || 
    req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    // Invalid token but we continue anyway
    next();
  }
};

/**
 * Check if user is in incognito mode
 */
export const isIncognitoUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.isIncognito) {
    return res.status(403).json({
      success: false,
      message: "This action is not available in incognito mode. Your cosmic journey remains private."
    });
  }
  next();
};
