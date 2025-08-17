import React from 'react';
import { UIRangeSlider } from 'components/UI/UIRangeSlider/UIRangeSlider';

import s from './styles.module.css';
import classnames from 'classnames';

export const UIRangeSliderValues = ({
  value,
  onChange,
  valuePostfix = '',
  title,
  name,
  step = 1,
  min = 1,
  max = 10,
  mobileView = false,
}) => {
  return (
    <div
      className={classnames({
        [s.rangeSliderValues]: true,
        [s.mobileView]: mobileView,
      })}
    >
      <div className={s.values}>
        <label className={s.title}>{title}</label>
        <span
          className={classnames({
            [s.count]: true,
            [s.mobile]: true,
          })}
        >
          <span>{value}</span>
          {!!valuePostfix && <span className={s.light}>{valuePostfix}</span>}
        </span>
      </div>
      <span className={s.slider}>
        <UIRangeSlider
          value={value}
          onChange={onChange}
          name={name}
          min={min}
          max={max}
          step={step}
        />
      </span>
      <span className={`${s.count} ${s.desktop}`}>
        <span>{value}</span>
        {!!valuePostfix && <span className={s.light}>{valuePostfix}</span>}
      </span>
    </div>
  );
};
