import React from 'react';
import classnames from 'classnames';
import { useSession } from 'hooks/providers';
import { colors } from './helpers';
import { HScroll } from '../Common/HScroll/HScroll';

import s from './styles.module.css';

export const ColorsSlider = ({ handleChooseColor }) => {
  const { session } = useSession();
  return (
      <>
        <p className={s.title}>Previously used:</p>
        <div className={s.colors}>
          {colors.map(color => (
              <span
                  key={color}
                  role="presentation"
                  onClick={handleChooseColor(color)}
                  className={classnames({
                    [s.colorChoose]: true,
                    [s.activeColor]: color === session.color?.hex,
                  })}
              >
          <span style={{ backgroundColor: color }}/>
        </span>
          ))}
        </div>
      </>
  );
};
