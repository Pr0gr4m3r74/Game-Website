const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async getGames(params?: { status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/games${query ? `?${query}` : ''}`);
  }

  async createGame(data: { name: string; description: string; maxPlayers?: number }) {
    return this.request('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinGame(gameId: string) {
    return this.request(`/games/${gameId}/join`, {
      method: 'POST',
    });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}

export const api = new ApiClient();
