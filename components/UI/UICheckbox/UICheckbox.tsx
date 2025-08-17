import React from 'react';
import classnames from 'classnames';

import s from './styles.module.css';

export const UICheckbox = ({ active, onChange, name }) => {
  const handleChange = () => {
    onChange(!active, name);
  };

  return (
    <div role="presentation" onClick={handleChange} className={s.checkbox}>
      <span className={s.route}>
        <span
          className={classnames({
            [s.thumb]: true,
            [s.active]: active,
          })}
        />
      </span>
    </div>
  );
};
