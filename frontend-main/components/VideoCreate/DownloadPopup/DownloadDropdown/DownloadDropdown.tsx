import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { toggleOpen } from 'utils/handlers';
import { DownloadLink } from './DownloadLink';

import s from './styles.module.css';

export const DownloadDropdown = ({ urls }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    opened: false,
  });

  useOnClickOutside(dropdownRef, toggleOpen(setState, 'opened', false));

  return (
    <div
      className={classnames({
        [s.download]: true,
        [s.opened]: state.opened,
      })}
      role="presentation"
      onClick={toggleOpen(setState, 'opened')}
      ref={dropdownRef}
    >
      <span>Download</span>
      <UIIcon icon="angleDown" />
      <div className={s.dropList}>
        {Object.entries(urls).map(([format, url]) => {
          const blob = url as Blob|null;
          if(blob == null) return;
          return (<DownloadLink key={format} format={format} url={url}>{format}</DownloadLink>)
        })}
      </div>
    </div>
  );
};
