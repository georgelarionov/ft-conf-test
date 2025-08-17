import React, { useState, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { UIIconButton } from 'components/UI/UIIconButton/UIIconButton';
import { DownloadPopup } from 'components/VideoCreate/DownloadPopup/DownloadPopup';
import { STEPS } from 'type';
import { useSession, useUser } from 'hooks/providers';

import s from './styles.module.css';

type Props = {
  onUndo: () => void;
  onReload: () => void;
  onDelete: () => void;
  onFullScreen: () => void;
};

export const VisualContentFooterDesktop = ({
  onUndo,
  onReload,
  onDelete,
  onFullScreen,
}: Props) => {
  const { currentStep } = useSession();
  const { userCheckout } = useUser();
  const [state, setState] = useState({
    opened: false,
  });

  return (<>
    {currentStep.step === STEPS.CREATE_VIDEO && (<div className={s.desktopFooter}>
        <div className={s.videos}>
          <DownloadPopup />
        </div>
    </div>)}
    </>
  );
};
