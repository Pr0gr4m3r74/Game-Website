import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoaderWrapper, validateGLTFFile } from './loaders/GLTFLoader';
import { ATTACH_POINTS } from './utils/avatar-utils';

interface CosmeticUploaderProps {
  onSubmit?: (cosmetic: CosmeticMetadata) => void;
  onCancel?: () => void;
  className?: string;
}

export interface CosmeticMetadata {
  name: string;
  description: string;
  type: string;
  attachPoint: string;
  price: number;
  tags: string[];
  file?: File;
  previewUrl?: string;
}

const COSMETIC_TYPES = [
  { value: 'hat', label: 'Hat/Headwear' },
  { value: 'glasses', label: 'Glasses/Eyewear' },
  { value: 'hair', label: 'Hair' },
  { value: 'face', label: 'Face Accessory' },
  { value: 'body', label: 'Body Clothing' },
  { value: 'back', label: 'Back Item' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'shield', label: 'Shield' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'pet', label: 'Pet/Companion' },
  { value: 'effect', label: 'Visual Effect' },
];

const COMMON_TAGS = [
  'Legendary',
  'Epic',
  'Rare',
  'Common',
  'Animated',
  'Seasonal',
  'Limited',
  'Event',
  'Premium',
  'Starter',
];

const ModelPreview: React.FC<{ model: THREE.Object3D | null }> = ({ model }) => {
  if (!model) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666666" wireframe />
      </mesh>
    );
  }

  return <primitive object={model} />;
};

export const CosmeticUploader: React.FC<CosmeticUploaderProps> = ({
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewModel, setPreviewModel] = useState<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metadata, setMetadata] = useState<CosmeticMetadata>({
    name: '',
    description: '',
    type: 'hat',
    attachPoint: 'head',
    price: 100,
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    const validation = validateGLTFFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const loader = new GLTFLoaderWrapper();
      const gltf = await loader.loadFromFile(selectedFile);
      setPreviewModel(gltf.scene);

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);

      loader.dispose();
    } catch (err: any) {
      setError(err.message);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (key: keyof CosmeticMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    if (metadata.tags.includes(tag)) return;
    if (metadata.tags.length >= 5) {
      setError('Maximum 5 tags allowed');
      return;
    }

    setMetadata(prev => ({
      ...prev,
      tags: [...prev.tags, tag.trim()],
    }));
    setTagInput('');
    setError(null);
  };

  const handleRemoveTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!metadata.name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!metadata.description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (metadata.price < 0) {
      setError('Price must be positive');
      return;
    }

    const submissionData: CosmeticMetadata = {
      ...metadata,
      file,
      previewUrl: previewModel ? 'preview-generated' : undefined,
    };

    onSubmit?.(submissionData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 p-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">Upload Cosmetic Item</h2>
          <p className="text-gray-400">
            Upload a GLB or GLTF model to add a new cosmetic item to the game
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">3D Preview</h3>
            
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden mb-4">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                  <OrbitControls
                    enableZoom
                    enablePan
                    autoRotate={!loading}
                    autoRotateSpeed={2}
                  />
                  
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                  <directionalLight position={[-5, 3, -5]} intensity={0.5} />
                  
                  <ModelPreview model={previewModel} />
                  
                  <Environment preset="sunset" />
                  
                  <gridHelper args={[10, 10]} />
                </Suspense>
              </Canvas>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white">Loading model...</div>
                </div>
              )}
            </div>

            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="text-4xl mb-3">📦</div>
              
              {file ? (
                <div>
                  <p className="text-white font-semibold mb-1">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-blue-400 text-sm mt-2">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-semibold mb-1">
                    Drop your GLB/GLTF file here
                  </p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                  <p className="text-gray-500 text-xs mt-2">Max size: 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Item Details</h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={metadata.name}
                  onChange={(e) => handleMetadataChange('name', e.target.value)}
                  placeholder="e.g., Dragon Knight Helmet"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600"
                  maxLength={50}
                />
                <p className="text-gray-400 text-xs mt-1">{metadata.name.length}/50</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  placeholder="Describe the cosmetic item..."
                  rows={3}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600 resize-none"
                  maxLength={200}
                />
                <p className="text-gray-400 text-xs mt-1">
                  {metadata.description.length}/200
                </p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={metadata.type}
                  onChange={(e) => handleMetadataChange('type', e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600"
                >
                  {COSMETIC_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attach Point */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Attachment Point <span className="text-red-500">*</span>
                </label>
                <select
                  value={metadata.attachPoint}
                  onChange={(e) => handleMetadataChange('attachPoint', e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600"
                >
                  {Object.entries(ATTACH_POINTS).map(([key, point]) => (
                    <option key={key} value={key}>
                      {point.name.charAt(0).toUpperCase() + point.name.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-gray-400 text-xs mt-1">
                  Where the item attaches to the avatar
                </p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Price (Coins) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={metadata.price}
                  onChange={(e) => handleMetadataChange('price', parseInt(e.target.value) || 0)}
                  min="0"
                  step="10"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Tags (up to 5)
                </label>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    placeholder="Add a tag"
                    className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-600"
                    maxLength={20}
                  />
                  <button
                    onClick={() => handleAddTag(tagInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      disabled={metadata.tags.includes(tag)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded text-xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-semibold"
              >
                Upload Cosmetic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmeticUploader;
