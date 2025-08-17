import React from 'react';
import { UIRangeSliderValues } from 'components/UI/UIRangeSliderValues/UIRangeSliderValues';

import s from './styles.module.css';

export const TextureInputs = ({ onChange, values }) => {
  return (
    <div className={s.textureInputs}>
      <UIRangeSliderValues
        title="Metalness"
        value={values.metalness}
        onChange={onChange}
        name="metalness"
        min={0}
        max={100}
      />
      <UIRangeSliderValues
        title="Roughness"
        value={values.roughness}
        onChange={onChange}
        name="roughness"
        min={0}
        max={100}
      />
      <UIRangeSliderValues
        title="Normal"
        value={values.normal}
        onChange={onChange}
        name="normal"
        min={1}
        max={10}
      />
    </div>
  );
};
