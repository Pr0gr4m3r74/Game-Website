import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import {
  loadAvatarModel,
  applyCustomization,
  attachCosmetic,
  removeCosmetic,
  exportAvatar,
  getAvailableMorphTargets,
  AvatarCustomization,
  CosmeticItem,
} from './utils/avatar-utils';
import { GLTFLoaderWrapper } from './loaders/GLTFLoader';

interface AvatarEditorProps {
  initialAvatarUrl?: string;
  onSave?: (avatarData: string) => void;
  cosmetics?: CosmeticItem[];
  className?: string;
}

interface AvatarModelProps {
  model: THREE.Object3D | null;
}

const AvatarModel: React.FC<AvatarModelProps> = ({ model }) => {
  if (!model) return null;
  return <primitive object={model} />;
};

const LoadingFallback: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 2, 0.5]} />
    <meshStandardMaterial color="#cccccc" />
  </mesh>
);

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  initialAvatarUrl,
  onSave,
  cosmetics = [],
  className = '',
}) => {
  const [avatarModel, setAvatarModel] = useState<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [isMobile, setIsMobile] = useState(false);

  const [customization, setCustomization] = useState<AvatarCustomization>({
    bodyColor: '#2196F3',
    hairColor: '#795548',
    eyeColor: '#4CAF50',
    skinTone: '#FFD1A1',
    scale: new THREE.Vector3(1, 1, 1),
    morphTargets: {},
  });

  const [equippedCosmetics, setEquippedCosmetics] = useState<string[]>([]);
  const [availableMorphs, setAvailableMorphs] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (initialAvatarUrl) {
      loadAvatar(initialAvatarUrl);
    }
  }, [initialAvatarUrl]);

  useEffect(() => {
    if (avatarModel) {
      applyCustomization(avatarModel, customization);
      avatarModel.userData.customization = customization;
    }
  }, [customization, avatarModel]);

  const loadAvatar = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const model = await loadAvatarModel(url);
      setAvatarModel(model);
      const morphs = getAvailableMorphTargets(model);
      setAvailableMorphs(morphs);
    } catch (err: any) {
      setError(err?.message || 'Failed to load avatar model');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const loader = new GLTFLoaderWrapper();
      const gltf = await loader.loadFromFile(file);
      setAvatarModel(gltf.scene);
      const morphs = getAvailableMorphTargets(gltf.scene);
      setAvailableMorphs(morphs);
      loader.dispose();
    } catch (err: any) {
      setError(err?.message || 'Failed to load avatar file');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipCosmetic = (cosmetic: CosmeticItem) => {
    if (!avatarModel) return;

    if (equippedCosmetics.includes(cosmetic.id)) {
      removeCosmetic(avatarModel, cosmetic.id);
      setEquippedCosmetics(prev => prev.filter(id => id !== cosmetic.id));
    } else {
      attachCosmetic(avatarModel, cosmetic, cosmetic.attachPoint);
      setEquippedCosmetics(prev => [...prev, cosmetic.id]);
    }
  };

  const handleSave = () => {
    if (!avatarModel) return;
    const data = exportAvatar(avatarModel);
    onSave?.(data);
  };

  const handleColorChange = (key: keyof AvatarCustomization, value: string) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setCustomization(prev => ({
      ...prev,
      scale: new THREE.Vector3(
        axis === 'x' ? value : prev.scale?.x || 1,
        axis === 'y' ? value : prev.scale?.y || 1,
        axis === 'z' ? value : prev.scale?.z || 1
      ),
    }));
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen bg-gray-900 ${className}`}>
      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <Canvas shadows className="w-full h-full">
          <Suspense fallback={<LoadingFallback />}>
            <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
            <OrbitControls
              enablePan={!isMobile}
              enableZoom
              enableRotate
              maxDistance={10}
              minDistance={1}
              target={[0, 1, 0]}
            />
            
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <directionalLight position={[-5, 3, -5]} intensity={0.5} />
            
            <AvatarModel model={avatarModel} />
            
            <Grid
              args={[10, 10]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#6f6f6f"
              sectionSize={1}
              sectionThickness={1}
              sectionColor="#9d4b4b"
              fadeDistance={25}
              fadeStrength={1}
              followCamera={false}
            />
            
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-4 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-96 bg-gray-800 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-white mb-4">Avatar Editor</h2>

          {/* Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setMode('quick')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'quick' ? 'bg-blue-600' : 'bg-gray-700'
              } text-white`}
            >
              Quick Mode
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'advanced' ? 'bg-blue-600' : 'bg-gray-700'
              } text-white`}
            >
              Advanced
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-white mb-2">Load Avatar Model</label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleFileUpload}
              className="w-full text-white bg-gray-700 p-2 rounded"
            />
          </div>

          {/* Customization Panel */}
          {mode === 'quick' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Colors</h3>
              
              <div>
                <label className="block text-white mb-1">Body Color</label>
                <input
                  type="color"
                  value={customization.bodyColor}
                  onChange={(e) => handleColorChange('bodyColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Hair Color</label>
                <input
                  type="color"
                  value={customization.hairColor}
                  onChange={(e) => handleColorChange('hairColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Eye Color</label>
                <input
                  type="color"
                  value={customization.eyeColor}
                  onChange={(e) => handleColorChange('eyeColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Skin Tone</label>
                <input
                  type="color"
                  value={customization.skinTone}
                  onChange={(e) => handleColorChange('skinTone', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {mode === 'advanced' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Advanced Options</h3>
              
              <div>
                <label className="block text-white mb-1">Scale X: {customization.scale?.x.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={customization.scale?.x || 1}
                  onChange={(e) => handleScaleChange('x', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Scale Y: {customization.scale?.y.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={customization.scale?.y || 1}
                  onChange={(e) => handleScaleChange('y', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Scale Z: {customization.scale?.z.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={customization.scale?.z || 1}
                  onChange={(e) => handleScaleChange('z', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {Object.entries(availableMorphs).map(([meshName, morphs]) => (
                <div key={meshName} className="mt-4">
                  <h4 className="text-white text-sm font-semibold mb-2">{meshName}</h4>
                  {morphs.slice(0, 3).map((morph) => (
                    <div key={morph} className="mb-2">
                      <label className="block text-white text-xs mb-1">{morph}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue="0"
                        onChange={(e) => {
                          setCustomization(prev => ({
                            ...prev,
                            morphTargets: {
                              ...prev.morphTargets,
                              [morph]: parseFloat(e.target.value),
                            },
                          }));
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Equipment Panel */}
          {cosmetics.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Cosmetics</h3>
              <div className="space-y-2">
                {cosmetics.map((cosmetic) => (
                  <button
                    key={cosmetic.id}
                    onClick={() => handleEquipCosmetic(cosmetic)}
                    className={`w-full p-3 rounded text-left ${
                      equippedCosmetics.includes(cosmetic.id)
                        ? 'bg-green-600'
                        : 'bg-gray-700'
                    } text-white hover:bg-opacity-80`}
                  >
                    <div className="font-semibold">{cosmetic.name}</div>
                    <div className="text-xs text-gray-300">{cosmetic.attachPoint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <button
              onClick={handleSave}
              disabled={!avatarModel}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-semibold"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;
