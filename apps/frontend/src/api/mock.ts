/**
 * Local mock fallback layer.
 *
 * When no real backend is available (e.g. Electron desktop mode) every API
 * call is intercepted and served from localStorage / in-memory mock data.
 * Data is persisted via localStorage so it survives app restarts.
 */

import type { AuthResponse, User, LoginRequest, RegisterRequest } from '../types/auth';
import type {
  Avatar,
  AvatarCustomization,
  Cosmetic,
  MarketplaceListing,
  World,
  PaginatedResponse,
} from '../types/game';

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// seed data
// ---------------------------------------------------------------------------

const MOCK_TOKEN = 'mock-jwt-token-for-local-dev';

const defaultUser: User = {
  id: 'user-1',
  username: 'player1',
  email: 'player1@example.com',
  displayName: 'Player One',
  locale: 'en',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultCosmetics: Cosmetic[] = [
  {
    id: 'cos-1',
    name: 'Cool Hair',
    description: 'A stylish hairstyle.',
    category: 'hair',
    rarity: 'rare',
    price: 100,
    modelPath: '/models/hair1.glb',
    thumbnailPath: '/img/hair1.png',
    isLimited: false,
  },
  {
    id: 'cos-2',
    name: 'Fancy Hat',
    description: 'An extravagant hat.',
    category: 'accessory',
    rarity: 'epic',
    price: 250,
    modelPath: '/models/hat1.glb',
    thumbnailPath: '/img/hat1.png',
    isLimited: false,
  },
  {
    id: 'cos-3',
    name: 'Stylish Outfit',
    description: 'Wear it with pride.',
    category: 'clothing',
    rarity: 'legendary',
    price: 500,
    modelPath: '/models/outfit1.glb',
    thumbnailPath: '/img/outfit1.png',
    isLimited: true,
    availableUntil: '2030-12-31T23:59:59Z',
  },
];

const defaultWorlds: World[] = [
  {
    id: 'world-1',
    name: 'Sunset Beach',
    description: 'A relaxing beach world.',
    creatorId: 'user-42',
    creatorName: 'WorldBuilder',
    thumbnailPath: '/img/world1.png',
    scenePath: '/scenes/beach.glb',
    maxPlayers: 50,
    currentPlayers: 15,
    isPublic: true,
    tags: ['beach', 'relax'],
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'world-2',
    name: 'Cyber City',
    description: 'Neon lights everywhere.',
    creatorId: 'user-43',
    creatorName: 'TechMaster',
    thumbnailPath: '/img/world2.png',
    scenePath: '/scenes/city.glb',
    maxPlayers: 100,
    currentPlayers: 32,
    isPublic: true,
    tags: ['cyberpunk', 'city'],
    rating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'world-3',
    name: 'Fantasy Castle',
    description: 'A medieval fortress.',
    creatorId: 'user-44',
    creatorName: 'MagicCreator',
    thumbnailPath: '/img/world3.png',
    scenePath: '/scenes/castle.glb',
    maxPlayers: 30,
    currentPlayers: 8,
    isPublic: true,
    tags: ['fantasy', 'medieval'],
    rating: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultListings: MarketplaceListing[] = [
  {
    id: 'listing-1',
    cosmeticId: 'cos-1',
    cosmetic: defaultCosmetics[0],
    sellerId: 'user-10',
    sellerName: 'Player123',
    price: 150,
    quantity: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-2',
    cosmeticId: 'cos-2',
    cosmetic: defaultCosmetics[1],
    sellerId: 'user-11',
    sellerName: 'GamerPro',
    price: 300,
    quantity: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-3',
    cosmeticId: 'cos-3',
    cosmetic: defaultCosmetics[2],
    sellerId: 'user-12',
    sellerName: 'MasterTrader',
    price: 1000,
    quantity: 1,
    createdAt: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// mock stores (persisted in localStorage)
// ---------------------------------------------------------------------------

function getUser(): User {
  return ls<User>('mock_user', defaultUser);
}

function getAvatars(): Avatar[] {
  return ls<Avatar[]>('mock_avatars', []);
}

function getCosmetics(): Cosmetic[] {
  return ls<Cosmetic[]>('mock_cosmetics', defaultCosmetics);
}

function getWorlds(): World[] {
  return ls<World[]>('mock_worlds', defaultWorlds);
}

function getListings(): MarketplaceListing[] {
  return ls<MarketplaceListing[]>('mock_listings', defaultListings);
}

// ---------------------------------------------------------------------------
// public mock API – mirrors the shape of the real API modules
// ---------------------------------------------------------------------------

/** Small artificial delay so the UI loading states feel real. */
const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));

// -- auth ------------------------------------------------------------------

export const mockAuthApi = {
  async login(_creds: LoginRequest): Promise<AuthResponse> {
    await delay();
    const user = getUser();
    localStorage.setItem('auth_token', MOCK_TOKEN);
    return { user, token: MOCK_TOKEN };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay();
    const user: User = {
      ...defaultUser,
      id: uuid(),
      username: data.username,
      email: data.email,
      displayName: data.displayName,
      locale: data.locale,
    };
    save('mock_user', user);
    localStorage.setItem('auth_token', MOCK_TOKEN);
    return { user, token: MOCK_TOKEN };
  },

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem('auth_token');
  },

  async getProfile(): Promise<User> {
    await delay();
    return getUser();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay();
    const user = { ...getUser(), ...updates, updatedAt: new Date().toISOString() };
    save('mock_user', user);
    return user;
  },

  async changePassword(): Promise<void> {
    await delay();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};

// -- avatars ---------------------------------------------------------------

export const mockAvatarsApi = {
  async getMyAvatars(): Promise<Avatar[]> {
    await delay();
    return getAvatars();
  },

  async getAvatar(id: string): Promise<Avatar> {
    await delay();
    const found = getAvatars().find((a) => a.id === id);
    if (!found) throw new Error('Avatar not found');
    return found;
  },

  async createAvatar(data: { name: string; model: string; customization: AvatarCustomization }): Promise<Avatar> {
    await delay();
    const avatar: Avatar = {
      id: uuid(),
      userId: getUser().id,
      name: data.name,
      model: data.model,
      customization: data.customization,
      equippedCosmetics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [...getAvatars(), avatar];
    save('mock_avatars', list);
    return avatar;
  },

  async updateAvatar(id: string, updates: Partial<Avatar>): Promise<Avatar> {
    await delay();
    const list = getAvatars().map((a) =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a,
    );
    save('mock_avatars', list);
    return list.find((a) => a.id === id)!;
  },

  async deleteAvatar(id: string): Promise<void> {
    await delay();
    save('mock_avatars', getAvatars().filter((a) => a.id !== id));
  },

  async equipCosmetic(avatarId: string, cosmeticId: string): Promise<Avatar> {
    await delay();
    const list = getAvatars().map((a) => {
      if (a.id === avatarId && !a.equippedCosmetics.includes(cosmeticId)) {
        return { ...a, equippedCosmetics: [...a.equippedCosmetics, cosmeticId] };
      }
      return a;
    });
    save('mock_avatars', list);
    return list.find((a) => a.id === avatarId)!;
  },

  async unequipCosmetic(avatarId: string, cosmeticId: string): Promise<Avatar> {
    await delay();
    const list = getAvatars().map((a) => {
      if (a.id === avatarId) {
        return { ...a, equippedCosmetics: a.equippedCosmetics.filter((c) => c !== cosmeticId) };
      }
      return a;
    });
    save('mock_avatars', list);
    return list.find((a) => a.id === avatarId)!;
  },
};

// -- cosmetics -------------------------------------------------------------

export const mockCosmeticsApi = {
  async getCosmetics(params?: {
    category?: string;
    rarity?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Cosmetic>> {
    await delay();
    let items = getCosmetics();
    if (params?.category) items = items.filter((c) => c.category === params.category);
    if (params?.rarity) items = items.filter((c) => c.rarity === params.rarity);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    return {
      data: items.slice((page - 1) * limit, page * limit),
      page,
      perPage: limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    };
  },

  async getCosmetic(id: string): Promise<Cosmetic> {
    await delay();
    const found = getCosmetics().find((c) => c.id === id);
    if (!found) throw new Error('Cosmetic not found');
    return found;
  },

  async getMyCosmetics(): Promise<Cosmetic[]> {
    await delay();
    return ls<Cosmetic[]>('mock_my_cosmetics', []);
  },

  async purchaseCosmetic(cosmeticId: string) {
    await delay();
    const cosmetic = getCosmetics().find((c) => c.id === cosmeticId);
    if (!cosmetic) throw new Error('Cosmetic not found');
    const owned = ls<Cosmetic[]>('mock_my_cosmetics', []);
    if (!owned.find((c) => c.id === cosmeticId)) {
      save('mock_my_cosmetics', [...owned, cosmetic]);
    }
    return { success: true, data: { cosmetic } };
  },
};

// -- marketplace -----------------------------------------------------------

export const mockMarketplaceApi = {
  async getListings(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<MarketplaceListing>> {
    await delay();
    let items = getListings();
    if (params?.minPrice != null) items = items.filter((l) => l.price >= params.minPrice!);
    if (params?.maxPrice != null) items = items.filter((l) => l.price <= params.maxPrice!);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    return {
      data: items.slice((page - 1) * limit, page * limit),
      page,
      perPage: limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    };
  },

  async getListing(id: string): Promise<MarketplaceListing> {
    await delay();
    const found = getListings().find((l) => l.id === id);
    if (!found) throw new Error('Listing not found');
    return found;
  },

  async createListing(data: { cosmeticId: string; price: number; quantity: number }): Promise<MarketplaceListing> {
    await delay();
    const cosmetic = getCosmetics().find((c) => c.id === data.cosmeticId) ?? defaultCosmetics[0];
    const listing: MarketplaceListing = {
      id: uuid(),
      cosmeticId: data.cosmeticId,
      cosmetic,
      sellerId: getUser().id,
      sellerName: getUser().displayName,
      price: data.price,
      quantity: data.quantity,
      createdAt: new Date().toISOString(),
    };
    save('mock_listings', [...getListings(), listing]);
    return listing;
  },

  async purchaseListing(_listingId: string, _quantity: number): Promise<void> {
    await delay();
  },

  async cancelListing(listingId: string): Promise<void> {
    await delay();
    save('mock_listings', getListings().filter((l) => l.id !== listingId));
  },

  async getMyListings(): Promise<MarketplaceListing[]> {
    await delay();
    const userId = getUser().id;
    return getListings().filter((l) => l.sellerId === userId);
  },
};

// -- worlds ----------------------------------------------------------------

export const mockWorldsApi = {
  async getWorlds(params?: {
    isPublic?: boolean;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<World>> {
    await delay();
    let items = getWorlds();
    if (params?.isPublic != null) items = items.filter((w) => w.isPublic === params.isPublic);
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    return {
      data: items.slice((page - 1) * limit, page * limit),
      page,
      perPage: limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    };
  },

  async getWorld(id: string): Promise<World> {
    await delay();
    const found = getWorlds().find((w) => w.id === id);
    if (!found) throw new Error('World not found');
    return found;
  },

  async joinWorld(_id: string): Promise<{ connectionUrl: string }> {
    await delay();
    return { connectionUrl: 'ws://localhost:0/mock' };
  },

  async leaveWorld(_id: string): Promise<void> {
    await delay();
  },

  async getMyWorlds(): Promise<World[]> {
    await delay();
    return getWorlds().filter((w) => w.creatorId === getUser().id);
  },
};
