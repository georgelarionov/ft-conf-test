export type Action = {
  title: string;
};

export enum STEPS {
  CHOSE_CATEGORY = 'CHOSE_CATEGORY',
  TEXTURES = 'TEXTURES',
  TEXTURES_CATALOG = 'TEXTURES_CATALOG',
  CHOOSE_PRODUCT = 'CHOOSE_PRODUCT',
  SETTINGS = 'SETTINGS',
  ADD_COLOR = 'ADD_COLOR',
  CHOOSE_PRINT = 'CHOOSE_PRINT',
  CREATE_VIDEO = 'CREATE_VIDEO',
  LIGHT = 'LIGHT',
}

export type Step = {
  title: string;
  step: STEPS;
  require?: boolean;
  disabled?: boolean;
};
