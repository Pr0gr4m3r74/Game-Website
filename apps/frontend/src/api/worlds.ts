import api from './client';
import { mockWorldsApi } from './mock';
import { useMocks } from '../utils/env';
import type { World, PaginatedResponse } from '../types/game';

const realWorldsApi = {
  async getWorlds(params?: {
    isPublic?: boolean;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<World>> {
    const { data } = await api.get<PaginatedResponse<World>>('/worlds', { params });
    return data;
  },

  async getWorld(id: string): Promise<World> {
    const { data } = await api.get<World>(`/worlds/${id}`);
    return data;
  },

  async joinWorld(id: string): Promise<{ connectionUrl: string }> {
    const { data } = await api.post<{ connectionUrl: string }>(`/worlds/${id}/join`);
    return data;
  },

  async leaveWorld(id: string): Promise<void> {
    await api.post(`/worlds/${id}/leave`);
  },

  async getMyWorlds(): Promise<World[]> {
    const { data } = await api.get<World[]>('/worlds/my');
    return data;
  },
};

export const worldsApi = useMocks ? mockWorldsApi : realWorldsApi;
