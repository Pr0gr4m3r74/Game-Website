// Shared Types for Avatar3D Platform

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  locale: 'de' | 'en';
  isVerified: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CosmeticType {
  HEAD = 'HEAD',
  BODY = 'BODY',
  ACCESSORY = 'ACCESSORY',
  HAIR = 'HAIR',
  EYES = 'EYES',
  OUTFIT = 'OUTFIT',
  SKIN = 'SKIN',
  ANIMATION = 'ANIMATION',
}

export enum Visibility {
  PRIVATE = 'PRIVATE',
  FRIENDS = 'FRIENDS',
  PUBLIC = 'PUBLIC',
}

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  FILE_SIZE_MAX: 50 * 1024 * 1024,
} as const;
