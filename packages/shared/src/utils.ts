/**
 * Validation utilities
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
};

/**
 * Format utilities
 */

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
};

/**
 * Game utilities
 */

export const calculateLevel = (experience: number): number => {
  // Simple level calculation: level = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100));
};

export const experienceForNextLevel = (currentLevel: number): number => {
  return (currentLevel + 1) ** 2 * 100;
};

export const experienceProgress = (experience: number): { level: number; progress: number } => {
  const level = calculateLevel(experience);
  const currentLevelExp = level ** 2 * 100;
  const nextLevelExp = experienceForNextLevel(level);
  const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  return { level, progress };
};

/**
 * ID generation
 */

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Constants
 */

export const CONSTANTS = {
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
  MAX_BIO_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 1000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};
