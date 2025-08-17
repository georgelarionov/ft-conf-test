import React from 'react';

import s from './styles.module.css';
import classnames from 'classnames';

export const UIRangeSlider = ({
  className = '',
  min = 1,
  max = 100,
  step = 1,
  value,
  onChange,
  name = '',
  thin = false,
}) => {
  return (
    <div
      className={classnames(s.rangeSlider, className, {
        [s.thin]: thin,
      })}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        name={name}
        step={step}
      />
    </div>
  );
};
