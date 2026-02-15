export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  AVATARS: {
    BASE: '/avatars',
    MY: '/avatars/my',
    BY_ID: (id: string) => `/avatars/${id}`,
    EQUIP: (avatarId: string, cosmeticId: string) => `/avatars/${avatarId}/equip/${cosmeticId}`,
    UNEQUIP: (avatarId: string, cosmeticId: string) => `/avatars/${avatarId}/unequip/${cosmeticId}`,
  },
  COSMETICS: {
    BASE: '/cosmetics',
    MY: '/cosmetics/my',
    BY_ID: (id: string) => `/cosmetics/${id}`,
    PURCHASE: (id: string) => `/cosmetics/${id}/purchase`,
  },
  MARKETPLACE: {
    BASE: '/marketplace',
    MY: '/marketplace/my',
    BY_ID: (id: string) => `/marketplace/${id}`,
    PURCHASE: (id: string) => `/marketplace/${id}/purchase`,
  },
  WORLDS: {
    BASE: '/worlds',
    MY: '/worlds/my',
    BY_ID: (id: string) => `/worlds/${id}`,
    JOIN: (id: string) => `/worlds/${id}/join`,
    LEAVE: (id: string) => `/worlds/${id}/leave`,
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LOCALE: 'locale',
  THEME: 'theme',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AVATAR_EDITOR: '/avatar-editor',
  COSMETICS: '/cosmetics',
  MARKETPLACE: '/marketplace',
  WORLDS: '/worlds',
  ADMIN: '/admin',
};
