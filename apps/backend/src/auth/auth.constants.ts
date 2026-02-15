/**
 * Authentication Constants
 * 
 * Centralized configuration constants for the authentication module
 */

export const AUTH_CONSTANTS = {
  // Password hashing
  BCRYPT_SALT_ROUNDS: 10, // Balance between security and performance
  
  // Token expiry
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  
  // Cookie names
  ACCESS_TOKEN_COOKIE: 'access_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
  
  // Cookie expiry in milliseconds
  ACCESS_TOKEN_COOKIE_MAX_AGE: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

/**
 * Cookie configuration helper
 */
export const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
});
