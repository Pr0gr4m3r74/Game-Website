import React, { useState } from 'react';
import { AvatarEditor } from './AvatarEditor';
import { AvatarQuickCreator } from './AvatarQuickCreator';
import { CosmeticUploader } from './CosmeticUploader';
import { AvatarViewer2D } from './AvatarViewer2D';
import { CosmeticItem, AvatarCustomization } from './utils/avatar-utils';
import { CosmeticMetadata } from './CosmeticUploader';

type ViewMode = 'quick' | 'editor' | 'uploader' | 'viewer2d';

interface SavedAvatar {
  name: string;
  customization: AvatarCustomization;
  cosmetics: CosmeticItem[];
  thumbnailUrl?: string;
}

/**
 * Example component demonstrating the Three.js Avatar System
 * 
 * This shows how to integrate all avatar components in a real application.
 */
export const AvatarSystemDemo: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('quick');
  const [savedAvatar, setSavedAvatar] = useState<SavedAvatar | null>(null);
  const cosmetics: CosmeticItem[] = [];

  const handleQuickCreatorComplete = (data: {
    name: string;
    customization: AvatarCustomization;
    accessories: string[];
  }) => {
    console.log('Avatar created via Quick Creator:', data);
    
    setSavedAvatar({
      name: data.name,
      customization: data.customization,
      cosmetics: [],
    });
    
    setMode('editor');
  };

  const handleEditorSave = (avatarData: string) => {
    console.log('Avatar saved from Editor:', avatarData);
    alert('Avatar saved successfully!');
  };

  const handleCosmeticUpload = async (cosmetic: CosmeticMetadata) => {
    console.log('Cosmetic uploaded:', cosmetic);
    
    // In a real app, you would upload to backend here
    // Example:
    // const formData = new FormData();
    // formData.append('file', cosmetic.file);
    // formData.append('metadata', JSON.stringify(cosmetic));
    // const response = await fetch('/api/cosmetics', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    alert(`Cosmetic "${cosmetic.name}" uploaded successfully!`);
    setMode('editor');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Avatar System Demo</h1>
            
            <nav className="flex gap-2">
              <button
                onClick={() => setMode('quick')}
                className={`px-4 py-2 rounded ${
                  mode === 'quick'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Quick Creator
              </button>
              <button
                onClick={() => setMode('editor')}
                className={`px-4 py-2 rounded ${
                  mode === 'editor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMode('uploader')}
                className={`px-4 py-2 rounded ${
                  mode === 'uploader'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Upload Cosmetic
              </button>
              <button
                onClick={() => setMode('viewer2d')}
                className={`px-4 py-2 rounded ${
                  mode === 'viewer2d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                disabled={!savedAvatar}
              >
                2D Viewer
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {mode === 'quick' && (
          <AvatarQuickCreator
            onComplete={handleQuickCreatorComplete}
            onCancel={() => console.log('Quick creator cancelled')}
          />
        )}

        {mode === 'editor' && (
          <AvatarEditor
            initialAvatarUrl="/models/avatar.glb" // Replace with actual avatar URL
            onSave={handleEditorSave}
            cosmetics={cosmetics}
          />
        )}

        {mode === 'uploader' && (
          <CosmeticUploader
            onSubmit={handleCosmeticUpload}
            onCancel={() => setMode('editor')}
          />
        )}

        {mode === 'viewer2d' && savedAvatar && (
          <div className="max-w-4xl mx-auto p-8">
            <AvatarViewer2D
              avatarData={{
                name: savedAvatar.name,
                customization: savedAvatar.customization,
                cosmetics: savedAvatar.cosmetics.map(c => ({
                  id: c.id,
                  name: c.name,
                  attachPoint: c.attachPoint,
                })),
                thumbnailUrl: savedAvatar.thumbnailUrl,
              }}
              onViewIn3D={() => setMode('editor')}
            />
          </div>
        )}
      </main>

      {/* Info Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400 text-sm">
            <p>
              <strong>Tips:</strong> Use Quick Creator for fast setup, Editor for detailed customization,
              and Uploader to add custom cosmetics.
            </p>
            {savedAvatar && (
              <p className="mt-1 text-green-400">
                ✓ Avatar "{savedAvatar.name}" is active
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AvatarSystemDemo;
