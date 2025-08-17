export type Product = {
  title: string;
  slug: string;
  image: string;
  author?: string;
  price?: number;
  // model data
  modelName: string;
  mainTexName: string;
  modelScale: number;
  flipBaseMapY: number;
  flipBaseMapX?: number;
  offset: {
    x: number,
    z: number,
    y: number
  }
};
