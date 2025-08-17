import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { UIButton } from 'components/UI/UIButton/UIButton';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { useSession } from 'hooks/providers';
import { ExportModelFormat, ExportModel } from '../../ModelView/Exports/ExportModel';

import s from './styles.module.css';

export const ActionsHead = () => {
  const { currentStep } = useSession();
  const [opened, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!opened);
  const closePanel = () => setOpen(false);

  useEffect(() => {
    window.addEventListener('scroll', closePanel);
    return () => {
      window.removeEventListener('scroll', closePanel);
    };
  }, []);

  return (
    <div className={s.actionHead} id="actionHead">
      <UIButton onClick={() => ExportModel.export(ExportModelFormat.USDZ)} className={s.arBtn}>
        <UIIcon icon="cube" />
        <span>AR</span>
      </UIButton>
      <p className={s.step}>{currentStep.title}</p>
      <div className={s.mobile}>
        <UIIcon icon="burger" onClick={toggleOpen} />
        <div
          className={classnames({
            [s.mobileActions]: true,
            [s.opened]: opened,
          })}
        >
            <UIButton onClick={() => ExportModel.export(ExportModelFormat.USDZ)}>AR mode</UIButton>
            <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 512)}>Glb 1</UIButton>
            <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 1024)}>Glb 2</UIButton>
            <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 2048)}>Glb 3</UIButton>
        </div>
      </div>
      <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 512)}>Glb 1</UIButton>
      <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 1024)}>Glb 2</UIButton>
      <UIButton onClick={() => ExportModel.export(ExportModelFormat.GLB, true, 2048)}>Glb 3</UIButton>
    </div>
  );
};
