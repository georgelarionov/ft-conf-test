import * as THREE from 'three';
import { TextureLoader } from 'three';
import { SVGToCanvas } from './svgToCanvas';
import { PrintFileType } from '../type/print';

export interface LoadedImage {
  texture: THREE.Texture;
  type: PrintFileType;
  originalContent?: string;
  metadata?: {
    width: number;
    height: number;
  };
}

export class UniversalImageLoader {
  private static textureLoader = new TextureLoader();
  
  /**
   * Определяет тип файла по расширению
   */
  static getFileType(filename: string): PrintFileType {
    const extension = filename.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'svg':
        return PrintFileType.VECTOR;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return PrintFileType.RASTER;
      default:
        // Пытаемся определить по MIME типу если это data URL
        if (filename.startsWith('data:')) {
          if (filename.includes('image/svg+xml')) {
            return PrintFileType.VECTOR;
          }
        }
        return PrintFileType.RASTER;
    }
  }
  
  /**
   * Загружает изображение любого поддерживаемого типа
   */
  static async load(
    url: string, 
    options?: {
      color?: string;
      width?: number;
      height?: number;
    }
  ): Promise<LoadedImage> {
    const fileType = this.getFileType(url);
    
    if (fileType === PrintFileType.VECTOR) {
      return this.loadSVG(url, options);
    } else {
      return this.loadRaster(url);
    }
  }
  
  /**
   * Загружает растровое изображение
   */
  private static async loadRaster(url: string): Promise<LoadedImage> {
    try {
      const texture = await this.textureLoader.loadAsync(url);
      
      return {
        texture,
        type: PrintFileType.RASTER,
        metadata: {
          width: texture.image.width,
          height: texture.image.height
        }
      };
    } catch (error) {
      console.error('Error loading raster image:', error);
      throw error;
    }
  }
  
  /**
   * Загружает SVG изображение
   */
  private static async loadSVG(
    url: string, 
    options?: {
      color?: string;
      width?: number;
      height?: number;
    }
  ): Promise<LoadedImage> {
    try {
      // Загружаем оригинальный SVG контент
      let originalContent: string | undefined;
      
      if (!url.startsWith('data:')) {
        const response = await fetch(url);
        originalContent = await response.text();
      }
      
      // Конвертируем в текстуру
      const texture = await SVGToCanvas.convertToTexture(url, {
        color: options?.color,
        width: options?.width || 1024,
        height: options?.height || 1024,
        preserveAspectRatio: true
      });
      
      return {
        texture,
        type: PrintFileType.VECTOR,
        originalContent,
        metadata: {
          width: texture.image.width,
          height: texture.image.height
        }
      };
    } catch (error) {
      console.error('Error loading SVG image:', error);
      throw error;
    }
  }
  
  /**
   * Обновляет цвет SVG текстуры
   */
  static async updateSVGColor(
    url: string,
    color: string,
    options?: {
      width?: number;
      height?: number;
    }
  ): Promise<THREE.Texture> {
    if (this.getFileType(url) !== PrintFileType.VECTOR) {
      throw new Error('Cannot update color of non-SVG image');
    }
    
    return SVGToCanvas.convertToTexture(url, {
      color,
      width: options?.width || 1024,
      height: options?.height || 1024,
      preserveAspectRatio: true
    });
  }
} 