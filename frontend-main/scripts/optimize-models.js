#!/usr/bin/env node

/**
 * Скрипт для оптимизации GLTF/GLB моделей
 * Требует установки: npm install -g gltf-pipeline
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const modelsDir = path.join(__dirname, '../public/models');
const outputDir = path.join(__dirname, '../public/models-optimized');

// Создаем директорию для оптимизированных моделей
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function optimizeModel(inputPath, outputPath) {
  try {
    // Команда для оптимизации с помощью gltf-pipeline
    const command = `gltf-pipeline -i "${inputPath}" -o "${outputPath}" -d`;
    
    console.log(`Оптимизация: ${path.basename(inputPath)}`);
    execSync(command, { stdio: 'inherit' });
    
    // Сравнение размеров
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ Сжатие: ${reduction}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB)\n`);
    
    return { originalSize, optimizedSize };
  } catch (error) {
    console.error(`✗ Ошибка при оптимизации ${inputPath}:`, error.message);
    return null;
  }
}

function processDirectory(dir, outputBase) {
  const items = fs.readdirSync(dir);
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Создаем соответствующую директорию в output
      const outputSubDir = path.join(outputBase, item);
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }
      
      // Рекурсивно обрабатываем поддиректории
      const subResult = processDirectory(fullPath, outputSubDir);
      totalOriginal += subResult.totalOriginal;
      totalOptimized += subResult.totalOptimized;
    } else if (item.endsWith('.gltf') || item.endsWith('.glb')) {
      const outputPath = path.join(outputBase, item);
      const result = optimizeModel(fullPath, outputPath);
      
      if (result) {
        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
      }
    } else {
      // Копируем другие файлы (текстуры, bin файлы)
      const outputPath = path.join(outputBase, item);
      fs.copyFileSync(fullPath, outputPath);
    }
  });
  
  return { totalOriginal, totalOptimized };
}

console.log('🚀 Начинаем оптимизацию 3D моделей...\n');

// Проверка наличия gltf-pipeline
try {
  execSync('gltf-pipeline --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ gltf-pipeline не установлен!');
  console.log('Установите его командой: npm install -g gltf-pipeline');
  process.exit(1);
}

// Обработка всех моделей
const result = processDirectory(modelsDir, outputDir);

// Итоговая статистика
console.log('\n📊 Итоговая статистика:');
console.log(`Исходный размер: ${(result.totalOriginal / 1024 / 1024).toFixed(2)}MB`);
console.log(`Оптимизированный размер: ${(result.totalOptimized / 1024 / 1024).toFixed(2)}MB`);
console.log(`Общее сжатие: ${((result.totalOriginal - result.totalOptimized) / result.totalOriginal * 100).toFixed(2)}%`);
console.log(`\n✅ Оптимизация завершена! Оптимизированные модели находятся в: ${outputDir}`);
console.log('\n⚠️  Не забудьте обновить пути к моделям в коде на /models-optimized/ вместо /models/');
