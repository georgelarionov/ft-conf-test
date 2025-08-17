// Collecting texture sample folder to TEXTURE enum

// const fs = require('fs');
import fs from 'fs';
// const path = require('path');
import path from 'path';
// const _ = require('lodash');
import _ from 'lodash';

const FOLDER = path.join(process.cwd(), 'public/textureSample');
const ENUM_FOLDER = path.join(process.cwd(), 'type/textureEnum.ts');
const EXCLUDE_FOLDER = [];

function getFiles(path, pattern) {
  const ss = fs.readdirSync(path);
  const result = [];
  ss.forEach(item => {
    const filePath = path + '/' + item;
    const stat = fs.statSync(filePath);
    if (EXCLUDE_FOLDER.find(ex => ex.test(filePath))) return;
    if (stat.isDirectory()) {
      result.push(getFiles(filePath, pattern));
    } else if (!pattern || pattern.test(item)) {
      result.push(filePath);
    }
  });

  return _.flatten(result);
}

const files = getFiles(FOLDER);
const texturesEnum = paths => {
  const enums = paths
    .map(file => {
      const filename = file.split('/').reverse()[0].split('.')[0];
      const key = `${filename.charAt(0).toUpperCase()}${filename.slice(1)}`;
      return `${key} = '${filename}',`;
    })
    .join('\n');

  const fileContent = `export enum TEXTURES {\n${enums}\n}`;
  return fs.writeFileSync(ENUM_FOLDER, fileContent);
};

texturesEnum(files);
