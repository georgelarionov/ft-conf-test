import React from 'react';
import { VisualContentFooterDesktop } from './VisualContentFooterDesktop/VisualContentFooterDesktop';
import { VisualContentFooterMobile } from './VisualContentFooterMobile/VisualContentFooterMobile';
import { useMeta } from 'hooks/providers';

export const VisualContentFooter = () => {
  const { isMobile } = useMeta();
  const onUndo = () => {};
  const onReload = () => {};
  const onDelete = () => {};
  const onFullScreen = () => {};

  return (
    <div>
      {!isMobile && (
        <VisualContentFooterDesktop
          onUndo={onUndo}
          onReload={onReload}
          onDelete={onDelete}
          onFullScreen={onFullScreen}
        />
      )}
      {isMobile && (
        <VisualContentFooterMobile
          onUndo={onUndo}
          onReload={onReload}
          onDelete={onDelete}
          onFullScreen={onFullScreen}
        />
      )}
    </div>
  );
};
