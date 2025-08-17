import { TEXTURES } from './textureEnum';

export type TextureItem = {
  title: string;
  image: string;
  slug: TEXTURES;
  repeat: { x: number; y: number };
  // default
  materialDefaults: MaterialProps;
  materialUse: MaterialUse;
};

export const DefaultMaterialProps: MaterialProps = {
  normal: 1, roughness: 100, metalness: 0
}

export type MaterialUse = {
  normal: boolean, rough: boolean
}

export type MaterialProps = {
  normal: number
  roughness: number
  metalness: number
}