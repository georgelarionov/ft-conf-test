import React from 'react';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';

import s from './styles.module.css';

type Props = {
  onUndo: () => void;
  onReload: () => void;
  onDelete: () => void;
  onFullScreen: () => void;
};

export const VisualContentFooterMobile = ({
  onUndo,
  onReload,
  onDelete,
  onFullScreen,
}: Props) => {
    // TODO ?
  return (
    <div className={s.mobileFooter}>
      {/*<UIIcon icon="reload" onClick={onReload} />*/}
      {/*<UIIcon icon="fullScreenAlt" onClick={onFullScreen} />*/}
      {/*<UIIcon icon="trash" onClick={onDelete} />*/}
      {/*<UIIcon icon="undo" onClick={onUndo} />*/}
    </div>
  );
};
