import * as THREE from 'three';
import { GLTFLoaderWrapper } from '../loaders/GLTFLoader';

export interface AvatarCustomization {
  bodyColor?: string;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  scale?: THREE.Vector3;
  morphTargets?: Record<string, number>;
}

export interface CosmeticItem {
  id: string;
  name: string;
  model: THREE.Object3D;
  attachPoint: string;
  offset?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

export interface AttachPoint {
  name: string;
  boneName?: string;
  defaultOffset: THREE.Vector3;
  defaultRotation: THREE.Euler;
}

export const ATTACH_POINTS: Record<string, AttachPoint> = {
  head: {
    name: 'head',
    boneName: 'Head',
    defaultOffset: new THREE.Vector3(0, 0, 0),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
  body: {
    name: 'body',
    boneName: 'Spine',
    defaultOffset: new THREE.Vector3(0, 0, 0),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
  leftHand: {
    name: 'leftHand',
    boneName: 'LeftHand',
    defaultOffset: new THREE.Vector3(0, 0, 0),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
  rightHand: {
    name: 'rightHand',
    boneName: 'RightHand',
    defaultOffset: new THREE.Vector3(0, 0, 0),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
  back: {
    name: 'back',
    boneName: 'Spine',
    defaultOffset: new THREE.Vector3(0, 0, -0.1),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
  feet: {
    name: 'feet',
    boneName: 'LeftFoot',
    defaultOffset: new THREE.Vector3(0, 0, 0),
    defaultRotation: new THREE.Euler(0, 0, 0),
  },
};

export const loadAvatarModel = async (
  url: string,
  onProgress?: (progress: number) => void
): Promise<THREE.Object3D> => {
  const loader = new GLTFLoaderWrapper();
  
  try {
    const gltf = await loader.load(url, {
      onProgress: (progress) => {
        if (onProgress) {
          onProgress(progress.percentage);
        }
      },
    });

    const model = gltf.scene;
    
    // Center and normalize the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    return model;
  } finally {
    loader.dispose();
  }
};

export const applyCustomization = (
  model: THREE.Object3D,
  customization: AvatarCustomization
): void => {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mesh = child as THREE.Mesh;

      // Apply colors
      if (mesh.material instanceof THREE.Material) {
        const material = mesh.material as any;
        
        if (mesh.name.toLowerCase().includes('body') && customization.bodyColor) {
          material.color = new THREE.Color(customization.bodyColor);
        }
        if (mesh.name.toLowerCase().includes('hair') && customization.hairColor) {
          material.color = new THREE.Color(customization.hairColor);
        }
        if (mesh.name.toLowerCase().includes('eye') && customization.eyeColor) {
          material.color = new THREE.Color(customization.eyeColor);
        }
        if (mesh.name.toLowerCase().includes('skin') && customization.skinTone) {
          material.color = new THREE.Color(customization.skinTone);
        }
      }

      // Apply morph targets
      if (customization.morphTargets && mesh.morphTargetInfluences) {
        Object.entries(customization.morphTargets).forEach(([name, value]) => {
          const index = mesh.morphTargetDictionary?.[name];
          if (index !== undefined && mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = value;
          }
        });
      }
    }
  });

  // Apply scale
  if (customization.scale) {
    model.scale.copy(customization.scale);
  }
};

export const attachCosmetic = (
  avatar: THREE.Object3D,
  cosmetic: CosmeticItem,
  attachPoint: string
): THREE.Object3D | null => {
  const point = ATTACH_POINTS[attachPoint];
  if (!point) {
    console.error(`Unknown attach point: ${attachPoint}`);
    return null;
  }

  let attachTarget: THREE.Object3D | null = null;

  // Find the bone or attachment point
  if (point.boneName) {
    avatar.traverse((child) => {
      if (child.name === point.boneName) {
        attachTarget = child;
      }
    });
  }

  // Fallback to root if bone not found
  if (!attachTarget) {
    attachTarget = avatar;
  }

  // Clone the cosmetic model
  const cosmeticClone = cosmetic.model.clone();
  
  // Apply offsets
  if (cosmetic.offset) {
    cosmeticClone.position.copy(cosmetic.offset);
  } else {
    cosmeticClone.position.copy(point.defaultOffset);
  }

  if (cosmetic.rotation) {
    cosmeticClone.rotation.copy(cosmetic.rotation);
  } else {
    cosmeticClone.rotation.copy(point.defaultRotation);
  }

  if (cosmetic.scale) {
    cosmeticClone.scale.copy(cosmetic.scale);
  }

  // Store metadata
  cosmeticClone.userData.cosmeticId = cosmetic.id;
  cosmeticClone.userData.attachPoint = attachPoint;

  attachTarget.add(cosmeticClone);
  return cosmeticClone;
};

export const removeCosmetic = (
  avatar: THREE.Object3D,
  cosmeticId: string
): boolean => {
  let removed = false;

  avatar.traverse((child) => {
    if (child.userData.cosmeticId === cosmeticId) {
      child.parent?.remove(child);
      removed = true;
    }
  });

  return removed;
};

export const exportAvatar = (avatar: THREE.Object3D): string => {
  const data = {
    position: avatar.position.toArray(),
    rotation: avatar.rotation.toArray(),
    scale: avatar.scale.toArray(),
    customization: avatar.userData.customization || {},
    cosmetics: [] as any[],
  };

  // Collect cosmetics
  avatar.traverse((child) => {
    if (child.userData.cosmeticId) {
      data.cosmetics.push({
        id: child.userData.cosmeticId,
        attachPoint: child.userData.attachPoint,
        offset: child.position.toArray(),
        rotation: child.rotation.toArray(),
        scale: child.scale.toArray(),
      });
    }
  });

  return JSON.stringify(data, null, 2);
};

export const getAvailableMorphTargets = (
  model: THREE.Object3D
): Record<string, string[]> => {
  const morphTargets: Record<string, string[]> = {};

  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.morphTargetDictionary) {
      morphTargets[child.name] = Object.keys(child.morphTargetDictionary);
    }
  });

  return morphTargets;
};

export const cloneAvatar = (avatar: THREE.Object3D): THREE.Object3D => {
  const clone = avatar.clone(true);
  
  // Deep copy user data
  clone.userData = JSON.parse(JSON.stringify(avatar.userData));
  
  return clone;
};

export const getBoundingBox = (object: THREE.Object3D): THREE.Box3 => {
  const box = new THREE.Box3().setFromObject(object);
  return box;
};

export const centerCamera = (
  camera: THREE.Camera,
  object: THREE.Object3D,
  distance: number = 2
): void => {
  const box = getBoundingBox(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera as any).fov ? (camera as any).fov * (Math.PI / 180) : 1;
  const cameraZ = Math.abs(maxDim / Math.tan(fov / 2)) * distance;

  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);
};

export const AVATAR_TEMPLATES = [
  {
    id: 'casual',
    name: 'Casual',
    customization: {
      bodyColor: '#2196F3',
      hairColor: '#795548',
      eyeColor: '#4CAF50',
      skinTone: '#FFD1A1',
      scale: new THREE.Vector3(1, 1, 1),
    },
  },
  {
    id: 'warrior',
    name: 'Warrior',
    customization: {
      bodyColor: '#C62828',
      hairColor: '#212121',
      eyeColor: '#FF5722',
      skinTone: '#D7A985',
      scale: new THREE.Vector3(1.1, 1.1, 1.1),
    },
  },
  {
    id: 'mage',
    name: 'Mage',
    customization: {
      bodyColor: '#673AB7',
      hairColor: '#9C27B0',
      eyeColor: '#E1BEE7',
      skinTone: '#F5E6D3',
      scale: new THREE.Vector3(0.95, 1.05, 0.95),
    },
  },
  {
    id: 'rogue',
    name: 'Rogue',
    customization: {
      bodyColor: '#424242',
      hairColor: '#37474F',
      eyeColor: '#00BCD4',
      skinTone: '#E8C8A0',
      scale: new THREE.Vector3(0.9, 1, 0.9),
    },
  },
];

export const COLOR_SCHEMES = [
  {
    id: 'blue-brown',
    name: 'Ocean Breeze',
    colors: {
      bodyColor: '#2196F3',
      hairColor: '#795548',
      eyeColor: '#4CAF50',
      skinTone: '#FFD1A1',
    },
  },
  {
    id: 'red-black',
    name: 'Fire Knight',
    colors: {
      bodyColor: '#C62828',
      hairColor: '#212121',
      eyeColor: '#FF5722',
      skinTone: '#D7A985',
    },
  },
  {
    id: 'purple-pink',
    name: 'Mystic Violet',
    colors: {
      bodyColor: '#673AB7',
      hairColor: '#9C27B0',
      eyeColor: '#E1BEE7',
      skinTone: '#F5E6D3',
    },
  },
  {
    id: 'green-gold',
    name: 'Forest Guardian',
    colors: {
      bodyColor: '#388E3C',
      hairColor: '#FFC107',
      eyeColor: '#8BC34A',
      skinTone: '#F0D5A8',
    },
  },
];
