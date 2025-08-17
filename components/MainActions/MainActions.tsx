import React from 'react';
import classnames from 'classnames';
import { ActionContent } from './ActionContent/ActionContent';

import s from './styles.module.css';

export const MainActions = () => {
  return (
    <div
      className={classnames('scrollList', {
        [s.mainActions]: true,
      })}
    >
      <ActionContent />
    </div>
  );
};
