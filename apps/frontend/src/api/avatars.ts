import api from './client';
import type { Avatar, AvatarCustomization } from '../types/game';

export const avatarsApi = {
  async getMyAvatars(): Promise<Avatar[]> {
    const { data } = await api.get<Avatar[]>('/avatars/my');
    return data;
  },

  async getAvatar(id: string): Promise<Avatar> {
    const { data } = await api.get<Avatar>(`/avatars/${id}`);
    return data;
  },

  async createAvatar(avatarData: {
    name: string;
    model: string;
    customization: AvatarCustomization;
  }): Promise<Avatar> {
    const { data } = await api.post<Avatar>('/avatars', avatarData);
    return data;
  },

  async updateAvatar(id: string, updates: Partial<Avatar>): Promise<Avatar> {
    const { data } = await api.patch<Avatar>(`/avatars/${id}`, updates);
    return data;
  },

  async deleteAvatar(id: string): Promise<void> {
    await api.delete(`/avatars/${id}`);
  },

  async equipCosmetic(avatarId: string, cosmeticId: string): Promise<Avatar> {
    const { data } = await api.post<Avatar>(`/avatars/${avatarId}/equip/${cosmeticId}`);
    return data;
  },

  async unequipCosmetic(avatarId: string, cosmeticId: string): Promise<Avatar> {
    const { data } = await api.post<Avatar>(`/avatars/${avatarId}/unequip/${cosmeticId}`);
    return data;
  },
};
