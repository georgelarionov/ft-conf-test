import { STEPS } from 'type';

export const stepsOrder = [
  { step: STEPS.CHOSE_CATEGORY },
  { step: STEPS.CHOOSE_PRODUCT },
  {
    step: STEPS.SETTINGS,
    children: [
      STEPS.ADD_COLOR,
      STEPS.CHOOSE_PRINT,
      STEPS.CREATE_VIDEO,
      STEPS.LIGHT,
      STEPS.TEXTURES,
    ],
  },
];

export const steps: Record<STEPS, any> = {
  [STEPS.CHOSE_CATEGORY]: {
    title: 'Choose item',
    require: true,
  },
  [STEPS.CHOOSE_PRODUCT]: {
    title: 'Choose item',
    require: true,
  },
  [STEPS.SETTINGS]: {
    title: 'Settings',
    require: true,
  },
  [STEPS.ADD_COLOR]: {
    title: 'Choose color',
  },
  [STEPS.CHOOSE_PRINT]: {
    title: 'Choose design',
  },
  [STEPS.CREATE_VIDEO]: {
    title: 'Create a video',
  },
  [STEPS.TEXTURES]: {
    title: 'Textures',
  },
  [STEPS.TEXTURES_CATALOG]: {
    title: 'Textures catalog',
  },
  [STEPS.LIGHT]: {
    title: 'Light',
  },
};
