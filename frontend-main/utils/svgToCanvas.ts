import * as THREE from 'three';

export interface SVGConversionOptions {
  width?: number;
  height?: number;
  color?: string;
  preserveAspectRatio?: boolean;
}

export class SVGToCanvas {
  private static cache = new Map<string, THREE.Texture>();
  
  /**
   * Конвертирует SVG в текстуру Three.js с возможностью изменения цвета
   */
  static async convertToTexture(
    svgUrl: string, 
    options: SVGConversionOptions = {}
  ): Promise<THREE.Texture> {
    const { 
      width = 1024, 
      height = 1024, 
      color,
      preserveAspectRatio = true 
    } = options;
    
    // Проверяем кеш
    const cacheKey = `${svgUrl}_${color || 'default'}_${width}_${height}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    try {
      // Загружаем SVG
      const response = await fetch(svgUrl);
      let svgText = await response.text();
      
      // Применяем цвет если указан
      if (color) {
        svgText = this.colorize(svgText, color);
      }
      
      // Создаем canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      // Создаем blob URL для SVG
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // Загружаем SVG в Image
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Вычисляем размеры для сохранения пропорций
          let drawWidth = width;
          let drawHeight = height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (preserveAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (aspectRatio > 1) {
              drawHeight = width / aspectRatio;
              offsetY = (height - drawHeight) / 2;
            } else {
              drawWidth = height * aspectRatio;
              offsetX = (width - drawWidth) / 2;
            }
          }
          
          // Очищаем canvas (прозрачный фон)
          ctx.clearRect(0, 0, width, height);
          
          // Рисуем SVG на canvas
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Создаем текстуру Three.js
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          
          // Кешируем результат
          this.cache.set(cacheKey, texture);
          
          // Освобождаем blob URL
          URL.revokeObjectURL(url);
          
          resolve(texture);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error(`Failed to load SVG: ${svgUrl}`));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.error('Error converting SVG to texture:', error);
      throw error;
    }
  }
  
  /**
   * Изменяет цвет SVG
   */
  static colorize(svgContent: string, color: string): string {
    // Парсим SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.documentElement;
    
    // Проверяем на ошибки парсинга
    if (svg.tagName === 'parsererror') {
      console.error('SVG parsing error');
      return svgContent;
    }
    
    // Функция для изменения цвета элемента
    const colorizeElement = (element: Element) => {
      // Изменяем fill
      if (element.hasAttribute('fill') && element.getAttribute('fill') !== 'none') {
        element.setAttribute('fill', color);
      }
      
      // Изменяем stroke
      if (element.hasAttribute('stroke') && element.getAttribute('stroke') !== 'none') {
        element.setAttribute('stroke', color);
      }
      
      // Изменяем стили
      const style = element.getAttribute('style');
      if (style) {
        const newStyle = style
          .replace(/fill:\s*[^;]+/g, `fill: ${color}`)
          .replace(/stroke:\s*[^;]+/g, `stroke: ${color}`);
        element.setAttribute('style', newStyle);
      }
      
      // Рекурсивно обрабатываем дочерние элементы
      Array.from(element.children).forEach(child => colorizeElement(child));
    };
    
    // Применяем цвет ко всем элементам
    colorizeElement(svg);
    
    // Преобразуем обратно в строку
    return new XMLSerializer().serializeToString(svg);
  }
  
  /**
   * Проверяет, является ли файл SVG
   */
  static isSVG(filename: string): boolean {
    return filename.toLowerCase().endsWith('.svg');
  }
  
  /**
   * Очищает кеш текстур
   */
  static clearCache(): void {
    this.cache.forEach(texture => {
      texture.dispose();
    });
    this.cache.clear();
  }
  
  /**
   * Получает размер кеша
   */
  static getCacheSize(): number {
    return this.cache.size;
  }
} 