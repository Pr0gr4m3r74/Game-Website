// User types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  friendCount: number;
  gamesPlayed: number;
  achievements: Achievement[];
}

// Game types
export interface Game {
  id: string;
  name: string;
  description: string;
  maxPlayers: number;
  currentPlayers: number;
  status: GameStatus;
  createdBy: string;
  createdAt: Date;
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// Social types
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: Date;
}

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

// Message types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  roomId: string;
  timestamp: Date;
}

// WebSocket events
export enum WSEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_GAME = 'join_game',
  LEAVE_GAME = 'leave_game',
  GAME_UPDATE = 'game_update',
  CHAT_MESSAGE = 'chat_message',
  PLAYER_ACTION = 'player_action',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
