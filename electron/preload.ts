import { contextBridge } from 'electron';

// Expose a minimal API to the renderer so it can detect it is
// running inside Electron without having full Node access.
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,
});
