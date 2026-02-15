// Main Components
export { AvatarEditor } from './AvatarEditor';
export { AvatarQuickCreator } from './AvatarQuickCreator';
export { CosmeticUploader } from './CosmeticUploader';
export { AvatarViewer2D } from './AvatarViewer2D';
export { AvatarSystemDemo } from './AvatarSystemDemo';

// Loaders
export { GLTFLoaderWrapper, createGLTFLoader, validateGLTFFile } from './loaders/GLTFLoader';
export type { LoadProgress, LoadOptions } from './loaders/GLTFLoader';

// Utilities
export {
  loadAvatarModel,
  applyCustomization,
  attachCosmetic,
  removeCosmetic,
  exportAvatar,
  getAvailableMorphTargets,
  cloneAvatar,
  getBoundingBox,
  centerCamera,
  ATTACH_POINTS,
  AVATAR_TEMPLATES,
  COLOR_SCHEMES,
} from './utils/avatar-utils';

export type {
  AvatarCustomization,
  CosmeticItem,
  AttachPoint,
} from './utils/avatar-utils';

export type { CosmeticMetadata } from './CosmeticUploader';
