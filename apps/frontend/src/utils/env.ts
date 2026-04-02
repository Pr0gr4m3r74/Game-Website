/**
 * Detect whether we are running inside Electron.
 * The preload script exposes `window.electronAPI.isDesktop`.
 * We also check for a missing backend (network errors) at runtime.
 */

interface ElectronAPI {
  isDesktop: boolean;
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

/** True when the renderer is running inside Electron. */
export const isDesktop: boolean =
  typeof window !== 'undefined' && !!window.electronAPI?.isDesktop;

/**
 * True when the app should use mock data instead of a real backend.
 * Enable automatically in Electron or when VITE_USE_MOCKS is set.
 */
export const useMocks: boolean =
  isDesktop || import.meta.env.VITE_USE_MOCKS === 'true';
