import api from './client';
import type { Cosmetic, PaginatedResponse } from '../types/game';
import type { ApiResponse } from '../types/api';

export const cosmeticsApi = {
  async getCosmetics(params?: {
    category?: string;
    rarity?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Cosmetic>> {
    const { data } = await api.get<PaginatedResponse<Cosmetic>>('/cosmetics', { params });
    return data;
  },

  async getCosmetic(id: string): Promise<Cosmetic> {
    const { data } = await api.get<Cosmetic>(`/cosmetics/${id}`);
    return data;
  },

  async getMyCosmetics(): Promise<Cosmetic[]> {
    const { data } = await api.get<Cosmetic[]>('/cosmetics/my');
    return data;
  },

  async purchaseCosmetic(cosmeticId: string): Promise<ApiResponse<{ cosmetic: Cosmetic }>> {
    const { data } = await api.post<ApiResponse<{ cosmetic: Cosmetic }>>(`/cosmetics/${cosmeticId}/purchase`);
    return data;
  },
};
