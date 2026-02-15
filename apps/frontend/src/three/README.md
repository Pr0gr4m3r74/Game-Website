# Three.js Avatar System

Comprehensive avatar creation and customization system built with Three.js, React Three Fiber, and React Three Drei.

## Components

### 1. AvatarEditor
Full-featured 3D avatar editor with real-time preview.

**Features:**
- Load GLB/GLTF avatar models
- Real-time 3D preview with orbit controls
- Quick mode (basic colors) and Advanced mode (scale, morphs)
- Cosmetic equipment system
- Touch controls for mobile devices
- Export avatar data

**Usage:**
```tsx
import { AvatarEditor } from './three';

<AvatarEditor
  initialAvatarUrl="/models/avatar.glb"
  onSave={(data) => console.log('Avatar saved:', data)}
  cosmetics={cosmeticsList}
/>
```

### 2. AvatarQuickCreator
Wizard-style avatar creator with 4 simple steps.

**Features:**
- Step 1: Choose from 4 preset templates
- Step 2: Select color scheme
- Step 3: Pick up to 3 accessories
- Step 4: Name and save
- Progress indicator
- Real-time 3D preview

**Usage:**
```tsx
import { AvatarQuickCreator } from './three';

<AvatarQuickCreator
  onComplete={(data) => {
    console.log('Avatar created:', data);
  }}
  onCancel={() => console.log('Cancelled')}
/>
```

### 3. CosmeticUploader
Upload and configure new cosmetic items.

**Features:**
- Drag & drop or file picker for GLB/GLTF files
- Real-time 3D preview with auto-rotation
- Metadata form (name, description, type, price, tags)
- Attachment point selector
- File validation (type, size)
- Support for up to 5 custom tags

**Usage:**
```tsx
import { CosmeticUploader } from './three';

<CosmeticUploader
  onSubmit={(cosmetic) => {
    console.log('Uploading:', cosmetic);
    // Upload to backend
  }}
  onCancel={() => console.log('Cancelled')}
/>
```

### 4. AvatarViewer2D
2D fallback for low-power devices.

**Features:**
- Static thumbnail display
- Expandable details panel
- Device capability detection
- Low-power mode indicator
- "View in 3D" upgrade button
- Performance tips

**Usage:**
```tsx
import { AvatarViewer2D } from './three';

<AvatarViewer2D
  avatarData={{
    name: 'My Avatar',
    customization: { ... },
    cosmetics: [ ... ],
    thumbnailUrl: '/avatars/thumb.png'
  }}
  onViewIn3D={() => switchTo3DView()}
/>
```

## Utilities

### GLTFLoader
Wrapper around Three.js GLTFLoader with enhanced features.

```ts
import { createGLTFLoader, validateGLTFFile } from './three';

// Create loader
const loader = createGLTFLoader({
  useDraco: true,
  onProgress: (progress) => console.log(`${progress.percentage}%`)
});

// Load from URL
const gltf = await loader.load('/models/avatar.glb');

// Load from file
const file = event.target.files[0];
const validation = validateGLTFFile(file);
if (validation.valid) {
  const gltf = await loader.loadFromFile(file);
}

loader.dispose();
```

### Avatar Utils

```ts
import {
  loadAvatarModel,
  applyCustomization,
  attachCosmetic,
  removeCosmetic,
  exportAvatar,
  AVATAR_TEMPLATES,
  COLOR_SCHEMES,
  ATTACH_POINTS,
} from './three';

// Load avatar
const model = await loadAvatarModel('/models/avatar.glb');

// Apply customization
applyCustomization(model, {
  bodyColor: '#2196F3',
  hairColor: '#795548',
  scale: new THREE.Vector3(1, 1, 1),
});

// Attach cosmetic
const cosmetic = {
  id: 'hat-001',
  name: 'Top Hat',
  model: hatModel,
  attachPoint: 'head',
};
attachCosmetic(model, cosmetic, 'head');

// Remove cosmetic
removeCosmetic(model, 'hat-001');

// Export avatar data
const data = exportAvatar(model);
```

### Attachment Points
Available attachment points for cosmetics:
- `head` - Headwear, hats, helmets
- `body` - Clothing, armor
- `leftHand` - Left-hand items
- `rightHand` - Right-hand items (weapons)
- `back` - Capes, backpacks, wings
- `feet` - Footwear

### Templates & Color Schemes

**Templates:**
- Casual - Blue and brown tones
- Warrior - Red and black, larger scale
- Mage - Purple tones, taller scale
- Rogue - Dark gray, lean build

**Color Schemes:**
- Ocean Breeze - Blue/brown/green
- Fire Knight - Red/black/orange
- Mystic Violet - Purple/pink
- Forest Guardian - Green/gold

## Mobile Responsiveness

All components are mobile-responsive:
- **Touch controls** for 3D orbit
- **Simplified UI** on small screens
- **Vertical layout** on mobile
- **Reduced features** in Quick Creator on mobile
- **Larger buttons** for touch targets

## Performance Considerations

### Low-Power Mode Detection
The system detects:
- Save-Data mode
- Slow connections (2G)
- Low memory devices (<4GB)
- Reduced motion preference

When detected, the system:
- Shows 2D fallback by default
- Disables auto-rotation
- Reduces shadow quality
- Simplifies controls

### File Size Limits
- GLB/GLTF files: Max 50MB
- Recommended: <5MB for best performance
- Use Draco compression for smaller files

## TypeScript Types

```ts
interface AvatarCustomization {
  bodyColor?: string;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  scale?: THREE.Vector3;
  morphTargets?: Record<string, number>;
}

interface CosmeticItem {
  id: string;
  name: string;
  model: THREE.Object3D;
  attachPoint: string;
  offset?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

interface CosmeticMetadata {
  name: string;
  description: string;
  type: string;
  attachPoint: string;
  price: number;
  tags: string[];
  file?: File;
  previewUrl?: string;
}
```

## Examples

### Complete Avatar Creation Flow

```tsx
import { useState } from 'react';
import { 
  AvatarQuickCreator, 
  AvatarEditor,
  CosmeticUploader 
} from './three';

function AvatarSystem() {
  const [mode, setMode] = useState<'quick' | 'advanced' | 'upload'>('quick');
  const [cosmetics, setCosmetics] = useState([]);

  return (
    <div>
      {mode === 'quick' && (
        <AvatarQuickCreator
          onComplete={(data) => {
            console.log('Quick avatar created:', data);
            setMode('advanced');
          }}
        />
      )}

      {mode === 'advanced' && (
        <AvatarEditor
          cosmetics={cosmetics}
          onSave={(data) => {
            console.log('Avatar saved:', data);
          }}
        />
      )}

      {mode === 'upload' && (
        <CosmeticUploader
          onSubmit={async (cosmetic) => {
            // Upload to backend
            await uploadCosmetic(cosmetic);
            setCosmetics(prev => [...prev, cosmetic]);
            setMode('advanced');
          }}
        />
      )}
    </div>
  );
}
```

### Custom Avatar Loading

```tsx
import { useEffect, useState } from 'react';
import { loadAvatarModel, applyCustomization } from './three';
import { Canvas } from '@react-three/fiber';

function CustomAvatarView({ avatarUrl, customization }) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadAvatarModel(avatarUrl).then(setModel);
  }, [avatarUrl]);

  useEffect(() => {
    if (model) {
      applyCustomization(model, customization);
    }
  }, [model, customization]);

  return (
    <Canvas>
      {model && <primitive object={model} />}
    </Canvas>
  );
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebGL 2.0 support

## Dependencies

- `three` ^0.161.0
- `@react-three/fiber` ^8.15.16
- `@react-three/drei` ^9.96.1
- `react` ^18.2.0

## Best Practices

1. **Always dispose loaders** after use to prevent memory leaks
2. **Validate files** before loading
3. **Use loading states** for better UX
4. **Handle errors gracefully**
5. **Test on mobile devices**
6. **Consider bandwidth** - use appropriate model sizes
7. **Provide 2D fallback** for accessibility

## Troubleshooting

### Model not loading
- Check file format (GLB recommended)
- Verify file size (<50MB)
- Check CORS headers for external URLs
- Ensure valid model structure

### Poor performance
- Reduce polygon count in models
- Use Draco compression
- Lower shadow quality
- Disable auto-rotation on mobile
- Use 2D fallback for low-power devices

### Touch controls not working
- Ensure OrbitControls is enabled
- Check for conflicting event handlers
- Test in mobile viewport

## License

MIT
