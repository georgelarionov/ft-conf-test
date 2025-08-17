import React, { useEffect, useState } from 'react';
import { toColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import { useSession, useUser } from 'hooks/providers';
import { ColorPicker } from 'components/Common/ColorPicker/ColorPicker';
import { STEPS, UserCheckout } from 'type';
import { ModelView } from '../ModelView/ModelView';
import { EditMode } from '../ModelView/View/ModelView.types';
import { ColorsSlider } from './ColorsSlider';
import { colors } from './helpers';
import * as THREE from 'three';

import s from './styles.module.css';

export const ColorSettings = () => {
  const { userCheckout } = useUser();
  const { setSession, currentStep } = useSession();
  const [color, setColor] = useState(userCheckout.color?.hex || colors[0]);

  const handleChooseColor = (color: string) => () => {
    const colorModel = toColor('hex', color);
    setColor(colorModel.hex);
    setSession({ color: colorModel });
  };

  const onColorChange = (color: UserCheckout['color']) => {
    setSession({ color });
    ModelView.Instance.setColor(new THREE.Color(color.hex));
  };

  useEffect(() => {
      ModelView.Instance.setEditMode(EditMode.Color);
      return () => {
        ModelView.Instance.setEditMode(EditMode.None);
      };
  }, [currentStep.step]);

  return (
    <>
      <div className={s.colorPicker}>
        <ColorPicker initialColor={color} onChange={onColorChange} />
        <ColorsSlider handleChooseColor={handleChooseColor} />
      </div>
    </>
  );
};
