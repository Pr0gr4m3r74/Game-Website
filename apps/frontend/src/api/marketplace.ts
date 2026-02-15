import api from './client';
import type { MarketplaceListing, PaginatedResponse } from '../types/game';

export const marketplaceApi = {
  async getListings(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<MarketplaceListing>> {
    const { data } = await api.get<PaginatedResponse<MarketplaceListing>>('/marketplace', { params });
    return data;
  },

  async getListing(id: string): Promise<MarketplaceListing> {
    const { data } = await api.get<MarketplaceListing>(`/marketplace/${id}`);
    return data;
  },

  async createListing(listingData: {
    cosmeticId: string;
    price: number;
    quantity: number;
  }): Promise<MarketplaceListing> {
    const { data } = await api.post<MarketplaceListing>('/marketplace', listingData);
    return data;
  },

  async purchaseListing(listingId: string, quantity: number): Promise<void> {
    await api.post(`/marketplace/${listingId}/purchase`, { quantity });
  },

  async cancelListing(listingId: string): Promise<void> {
    await api.delete(`/marketplace/${listingId}`);
  },

  async getMyListings(): Promise<MarketplaceListing[]> {
    const { data } = await api.get<MarketplaceListing[]>('/marketplace/my');
    return data;
  },
};
