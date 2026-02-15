import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import {
  AVATAR_TEMPLATES,
  COLOR_SCHEMES,
  AvatarCustomization,
} from './utils/avatar-utils';

interface AvatarQuickCreatorProps {
  onComplete?: (avatarData: { name: string; customization: AvatarCustomization; accessories: string[] }) => void;
  onCancel?: () => void;
  className?: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { number: 1, title: 'Choose Template', description: 'Select a base avatar style' },
  { number: 2, title: 'Color Scheme', description: 'Pick your favorite colors' },
  { number: 3, title: 'Accessories', description: 'Add some personality' },
  { number: 4, title: 'Name & Save', description: 'Give your avatar a name' },
];

const ACCESSORIES = [
  { id: 'hat', name: '🎩 Top Hat', type: 'head' },
  { id: 'glasses', name: '👓 Glasses', type: 'head' },
  { id: 'cape', name: '🦸 Cape', type: 'back' },
  { id: 'sword', name: '⚔️ Sword', type: 'rightHand' },
  { id: 'shield', name: '🛡️ Shield', type: 'leftHand' },
  { id: 'wings', name: '🪽 Wings', type: 'back' },
  { id: 'crown', name: '👑 Crown', type: 'head' },
  { id: 'boots', name: '👢 Boots', type: 'feet' },
];

const PreviewAvatar: React.FC<{ customization: AvatarCustomization }> = ({ customization }) => {
  return (
    <mesh>
      <boxGeometry args={[0.8, 1.8, 0.6]} />
      <meshStandardMaterial color={customization.bodyColor || '#2196F3'} />
    </mesh>
  );
};

export const AvatarQuickCreator: React.FC<AvatarQuickCreatorProps> = ({
  onComplete,
  onCancel,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(AVATAR_TEMPLATES[0]);
  const [selectedColorScheme, setSelectedColorScheme] = useState(COLOR_SCHEMES[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [avatarName, setAvatarName] = useState('');

  const [customization, setCustomization] = useState<AvatarCustomization>(
    AVATAR_TEMPLATES[0].customization
  );

  const handleTemplateSelect = (template: typeof AVATAR_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setCustomization(template.customization);
  };

  const handleColorSchemeSelect = (scheme: typeof COLOR_SCHEMES[0]) => {
    setSelectedColorScheme(scheme);
    setCustomization(prev => ({
      ...prev,
      ...scheme.colors,
    }));
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    setSelectedAccessories(prev => {
      if (prev.includes(accessoryId)) {
        return prev.filter(id => id !== accessoryId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, accessoryId];
    });
  };

  const handleComplete = () => {
    if (!avatarName.trim()) {
      alert('Please enter a name for your avatar');
      return;
    }

    onComplete?.({
      name: avatarName,
      customization,
      accessories: selectedAccessories,
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 3:
        return true;
      case 4:
        return avatarName.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 ${className}`}>
      {/* Progress Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="text-white text-sm font-semibold">{step.title}</div>
                    <div className="text-gray-400 text-xs">{step.description}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-xl font-bold mb-4">Preview</h3>
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    target={[0, 0.9, 0]}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 2}
                  />
                  
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <directionalLight position={[-5, 3, -5]} intensity={0.5} />
                  
                  <PreviewAvatar customization={customization} />
                  
                  <Environment preset="sunset" />
                </Suspense>
              </Canvas>
            </div>

            <div className="mt-4 bg-gray-900 rounded p-4">
              <h4 className="text-white font-semibold mb-2">Current Selection</h4>
              <div className="space-y-1 text-sm">
                <div className="text-gray-300">
                  <span className="text-gray-500">Template:</span> {selectedTemplate.name}
                </div>
                <div className="text-gray-300">
                  <span className="text-gray-500">Colors:</span> {selectedColorScheme.name}
                </div>
                <div className="text-gray-300">
                  <span className="text-gray-500">Accessories:</span> {selectedAccessories.length}/3
                </div>
              </div>
            </div>
          </div>

          {/* Options Panel */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-xl font-bold mb-4">
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </h3>

            <div className="mb-6">
              {/* Step 1: Choose Template */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {AVATAR_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedTemplate.id === template.id
                          ? 'border-blue-600 bg-blue-900 bg-opacity-30'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-white font-bold text-lg mb-2">{template.name}</div>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: template.customization.bodyColor }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: template.customization.hairColor }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: template.customization.eyeColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Color Scheme */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => handleColorSchemeSelect(scheme)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        selectedColorScheme.id === scheme.id
                          ? 'border-blue-600 bg-blue-900 bg-opacity-30'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-white font-bold mb-3">{scheme.name}</div>
                      <div className="grid grid-cols-4 gap-2">
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: scheme.colors.bodyColor }}
                          title="Body"
                        />
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: scheme.colors.hairColor }}
                          title="Hair"
                        />
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: scheme.colors.eyeColor }}
                          title="Eyes"
                        />
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: scheme.colors.skinTone }}
                          title="Skin"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Accessories */}
              {currentStep === 3 && (
                <div>
                  <p className="text-gray-400 text-sm mb-4">
                    Select up to 3 accessories ({selectedAccessories.length}/3)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCESSORIES.map((accessory) => (
                      <button
                        key={accessory.id}
                        onClick={() => handleAccessoryToggle(accessory.id)}
                        disabled={
                          !selectedAccessories.includes(accessory.id) &&
                          selectedAccessories.length >= 3
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAccessories.includes(accessory.id)
                            ? 'border-green-600 bg-green-900 bg-opacity-30'
                            : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="text-2xl mb-1">{accessory.name.split(' ')[0]}</div>
                        <div className="text-white text-sm font-semibold">
                          {accessory.name.split(' ').slice(1).join(' ')}
                        </div>
                        <div className="text-gray-400 text-xs">{accessory.type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Name & Save */}
              {currentStep === 4 && (
                <div>
                  <label className="block text-white mb-2 font-semibold">Avatar Name</label>
                  <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter a name for your avatar"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-600"
                    maxLength={30}
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    {avatarName.length}/30 characters
                  </p>

                  <div className="mt-6 p-4 bg-gray-900 rounded">
                    <h4 className="text-white font-semibold mb-3">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Template:</span>
                        <span className="font-semibold">{selectedTemplate.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Color Scheme:</span>
                        <span className="font-semibold">{selectedColorScheme.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Accessories:</span>
                        <span className="font-semibold">{selectedAccessories.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold"
                >
                  Back
                </button>
              )}
              
              {onCancel && currentStep === 1 && (
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold"
                >
                  Cancel
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-semibold"
                >
                  Create Avatar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarQuickCreator;
