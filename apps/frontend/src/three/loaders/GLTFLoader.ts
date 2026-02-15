import { GLTFLoader as ThreeGLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface LoadOptions {
  useDraco?: boolean;
  dracoPath?: string;
  onProgress?: (progress: LoadProgress) => void;
  timeout?: number;
}

export class GLTFLoaderWrapper {
  private loader: ThreeGLTFLoader;
  private dracoLoader?: DRACOLoader;

  constructor(options?: LoadOptions) {
    this.loader = new ThreeGLTFLoader();

    if (options?.useDraco) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(
        options.dracoPath || 'https://www.gstatic.com/draco/v1/decoders/'
      );
      this.loader.setDRACOLoader(this.dracoLoader);
    }
  }

  async load(
    url: string,
    options?: LoadOptions
  ): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      const timeout = options?.timeout || 30000;
      let timeoutId: NodeJS.Timeout | undefined;

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          reject(new Error(`Loading timeout after ${timeout}ms`));
        }, timeout);
      }

      this.loader.load(
        url,
        (gltf: GLTF) => {
          if (timeoutId) clearTimeout(timeoutId);
          resolve(gltf);
        },
        (progress: ProgressEvent) => {
          if (options?.onProgress) {
            const percentage = progress.total > 0
              ? (progress.loaded / progress.total) * 100
              : 0;
            options.onProgress({
              loaded: progress.loaded,
              total: progress.total,
              percentage,
            });
          }
        },
        (error: unknown) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(this.createDetailedError(error, url));
        }
      );
    });
  }

  async loadFromFile(file: File): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            throw new Error('Failed to read file');
          }

          const blob = new Blob([arrayBuffer]);
          const url = URL.createObjectURL(blob);

          const gltf = await this.load(url);
          URL.revokeObjectURL(url);
          resolve(gltf);
        } catch (error) {
          reject(this.createDetailedError(error, file.name));
        }
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private createDetailedError(error: any, source: string): Error {
    const message = error?.message || 'Unknown error';
    return new Error(
      `Failed to load GLTF from "${source}": ${message}`
    );
  }

  dispose(): void {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
  }
}

export const createGLTFLoader = (options?: LoadOptions): GLTFLoaderWrapper => {
  return new GLTFLoaderWrapper(options);
};

export const validateGLTFFile = (file: File): { valid: boolean; error?: string } => {
  const validExtensions = ['.glb', '.gltf'];
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];

  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Expected ${validExtensions.join(' or ')}`,
    };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};
