export enum PrintFileType {
  RASTER = 'raster', // PNG, JPG, JPEG, WEBP
  VECTOR = 'vector'  // SVG
}

export interface PrintData {
  id: string;
  image: string;
  opacity: number;
  type?: PrintFileType;
  color?: string; // Цвет для SVG
  originalContent?: string; // Оригинальный SVG контент
}

export interface PrintMetadata {
  width: number;
  height: number;
  fileType: PrintFileType;
  hasTransparency?: boolean;
  dominantColors?: string[];
} 