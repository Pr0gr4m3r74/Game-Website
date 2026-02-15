export interface Avatar {
  id: string;
  userId: string;
  name: string;
  model: string;
  customization: AvatarCustomization;
  equippedCosmetics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AvatarCustomization {
  bodyType: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  height: number;
  proportions: {
    head: number;
    body: number;
    arms: number;
    legs: number;
  };
}

export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  category: 'hair' | 'clothing' | 'accessory' | 'animation' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  modelPath: string;
  thumbnailPath: string;
  isLimited: boolean;
  availableUntil?: string;
}

export interface MarketplaceListing {
  id: string;
  cosmeticId: string;
  cosmetic: Cosmetic;
  sellerId: string;
  sellerName: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  thumbnailPath: string;
  scenePath: string;
  maxPlayers: number;
  currentPlayers: number;
  isPublic: boolean;
  tags: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
