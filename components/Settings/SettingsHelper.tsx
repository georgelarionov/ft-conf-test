import { STEPS } from 'type';
import {
  IconSettingsColor,
  IconSettingsDesign,
  IconSettingsTexture,
  IconSettingsLight,
  IconSettingsCreateVideo,
} from '../UI/UIIcon/IconData';

export const settings = [
  {
    title: 'Color',
    step: STEPS.ADD_COLOR,
    disabled: false,
    image: <IconSettingsColor />,
  },
  {
    title: 'Design',
    step: STEPS.CHOOSE_PRINT,
    disabled: false,
    image: <IconSettingsDesign />,
  },
  {
    title: 'Texture',
    step: STEPS.TEXTURES,
    disabled: false,
    image: <IconSettingsTexture />,
  },
  {
    title: 'Light',
    step: STEPS.LIGHT,
    disabled: false,
    image: <IconSettingsLight />,
  },
  {
    title: 'Create a video',
    step: STEPS.CREATE_VIDEO,
    disabled: false,
    image: <IconSettingsCreateVideo />,
  },
];
