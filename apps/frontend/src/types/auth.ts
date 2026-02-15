export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  locale: string;
  role: 'user' | 'admin';
  avatarId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  locale: string;
}
