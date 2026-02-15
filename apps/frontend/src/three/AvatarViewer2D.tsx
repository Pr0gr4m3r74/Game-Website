import React, { useState, useEffect } from 'react';
import { AvatarCustomization } from './utils/avatar-utils';

interface AvatarViewer2DProps {
  avatarData?: {
    name?: string;
    customization?: AvatarCustomization;
    cosmetics?: Array<{ id: string; name: string; attachPoint: string }>;
    thumbnailUrl?: string;
  };
  onViewIn3D?: () => void;
  className?: string;
}

const DEFAULT_THUMBNAIL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3NDE0RiIvPgogIDxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzIxOTZGMyIgcng9IjEwIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjRkZEMUExIi8+CiAgPGNpcmNsZSBjeD0iOTAiIGN5PSI0NSIgcj0iNCIgZmlsbD0iIzJFMkUyRSIvPgogIDxjaXJjbGUgY3g9IjExMCIgY3k9IjQ1IiByPSI0IiBmaWxsPSIjMkUyRTJFIi8+CiAgPHBhdGggZD0iTSA4NSA1NSBRIDEwMCA2MCAxMTUgNTUiIHN0cm9rZT0iIzJFMkUyRSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==';

export const AvatarViewer2D: React.FC<AvatarViewer2DProps> = ({
  avatarData,
  onViewIn3D,
  className = '',
}) => {
  const [isLowPower, setIsLowPower] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkDeviceCapabilities();
  }, []);

  const checkDeviceCapabilities = () => {
    // Check for low-power mode indicators
    const connection = (navigator as any).connection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsLowPower(isSaveData || isSlowConnection || isLowMemory || prefersReducedMotion);
  };

  const customization = avatarData?.customization;
  const cosmetics = avatarData?.cosmetics || [];
  const thumbnailUrl = avatarData?.thumbnailUrl || DEFAULT_THUMBNAIL;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Avatar Thumbnail */}
        <div className="relative mb-4">
          <img
            src={thumbnailUrl}
            alt={avatarData?.name || 'Avatar'}
            className="w-48 h-48 rounded-lg bg-gray-700 object-cover"
            loading="lazy"
          />
          
          {isLowPower && (
            <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
              Low Power
            </div>
          )}
        </div>

        {/* Avatar Name */}
        {avatarData?.name && (
          <h3 className="text-2xl font-bold text-white mb-2">{avatarData.name}</h3>
        )}

        {/* View in 3D Button */}
        {onViewIn3D && (
          <button
            onClick={onViewIn3D}
            className="mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <span>🎮</span>
            View in 3D
          </button>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-400 hover:text-blue-300 text-sm mb-4"
        >
          {showDetails ? '▼ Hide Details' : '▶ Show Details'}
        </button>

        {/* Avatar Details */}
        {showDetails && (
          <div className="w-full space-y-4">
            {/* Customization */}
            {customization && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Customization</h4>
                <div className="space-y-2">
                  {customization.bodyColor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Body Color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: customization.bodyColor }}
                        />
                        <span className="text-white text-sm font-mono">
                          {customization.bodyColor}
                        </span>
                      </div>
                    </div>
                  )}

                  {customization.hairColor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Hair Color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: customization.hairColor }}
                        />
                        <span className="text-white text-sm font-mono">
                          {customization.hairColor}
                        </span>
                      </div>
                    </div>
                  )}

                  {customization.eyeColor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Eye Color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: customization.eyeColor }}
                        />
                        <span className="text-white text-sm font-mono">
                          {customization.eyeColor}
                        </span>
                      </div>
                    </div>
                  )}

                  {customization.skinTone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Skin Tone</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: customization.skinTone }}
                        />
                        <span className="text-white text-sm font-mono">
                          {customization.skinTone}
                        </span>
                      </div>
                    </div>
                  )}

                  {customization.scale && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Scale</span>
                      <span className="text-white text-sm">
                        X: {customization.scale.x.toFixed(2)}, 
                        Y: {customization.scale.y.toFixed(2)}, 
                        Z: {customization.scale.z.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cosmetics */}
            {cosmetics.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">
                  Equipped Cosmetics ({cosmetics.length})
                </h4>
                <div className="space-y-2">
                  {cosmetics.map((cosmetic, index) => (
                    <div
                      key={`${cosmetic.id}-${index}`}
                      className="flex items-center justify-between bg-gray-800 p-2 rounded"
                    >
                      <div>
                        <div className="text-white text-sm font-semibold">
                          {cosmetic.name}
                        </div>
                        <div className="text-gray-400 text-xs capitalize">
                          {cosmetic.attachPoint.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                      <div className="text-green-400 text-xl">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {cosmetics.length}
                  </div>
                  <div className="text-gray-400 text-xs">Items</div>
                </div>
                <div className="bg-gray-800 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {customization ? Object.keys(customization).length : 0}
                  </div>
                  <div className="text-gray-400 text-xs">Custom</div>
                </div>
              </div>
            </div>

            {/* Device Info */}
            {isLowPower && (
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <span>⚡</span>
                  Low Power Mode Active
                </h4>
                <p className="text-yellow-200 text-sm">
                  3D rendering is disabled to save battery and data. 
                  You can still view your avatar in 2D or enable 3D view manually.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="w-full mt-6 flex gap-2">
          <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
            Share
          </button>
          <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
            Edit
          </button>
          <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
            Export
          </button>
        </div>

        {/* Performance Tip */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            💡 Tip: Connect to Wi-Fi for the best 3D experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarViewer2D;
