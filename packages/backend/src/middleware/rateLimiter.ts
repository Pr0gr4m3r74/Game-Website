import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const createRateLimiter = (
  windowMs: number,
  maxRequests: number
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or update the counter
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.',
      });
    }

    next();
  };
};

// Export preconfigured rate limiters
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
