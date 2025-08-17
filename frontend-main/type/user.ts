import * as THREE from 'three';
import { PrintMapItem } from 'components/ModelView/PrintMap/PrintMapItem';
import { Product } from './products';
import { texturesSamples } from '../components/TextureSettings/texturesSamples';

export type UserCheckout = {
  category: string;
  productCatalog: {
    slug: string;
    name: string;
  };
  product: Product;
  sample: {
    slug: string;
    name: string;
  };
  color: {
    hex: string;
  };
  parts: {
    color: string;
    texture: string;
  }[];
  prints: {
    color?: any;
    image: string;
    id: string;
    opacity?: number;
    position: THREE.Vector2;
    scale: THREE.Vector2;
    rotation: THREE.Vector2;
    loaded?: boolean;
    printMapItem: PrintMapItem;
  }[];
  video: {
    duration: number;
    slewRate: number;
    rotateSpeed: number;
    rotateCount: number;
    background: string;
    videoUrls: Record<string, Blob | null>;
  };
  light: {
    renderMap: string;
    useBackground: boolean;
    exposition: number;
  };
};

export type UserSession = UserCheckout & {
  product: Product;
  sample: {
    slug: string;
    image: string;
  };
  video: {
    duration: number;
    rotateSpeed: number;
    rotateCount: number;
    recording: boolean;
    playing: boolean;
  };
  texture: keyof typeof texturesSamples;
};
