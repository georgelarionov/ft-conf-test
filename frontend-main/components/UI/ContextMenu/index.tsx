import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import css from './styles.module.scss';
import IconContextMenu from '../UIIcon/IconData/icon-context-menu';
import { useOnClickOutside } from '../../../hooks/useClickOutside';

type ContextMenuItem = {
  id?: string;
  icon?: React.ReactNode;
  title: string | React.ReactNode;
  onClick?: (e: any) => void;
  disabled?: boolean;
  className?: string;
  hidden?: boolean;
  separator?: boolean;
  centered?: boolean;
};

export type ContextMenuProps = {
  id?: string;
  opened?: boolean;
  header?: React.ReactNode;
  items?: ContextMenuItem[];
  className?: string;
  onOpened?: (flag: boolean) => void;
  onClosed?: () => void;
  canClose?: boolean;
  position?: 'top' | 'bottom';
  children?: any;
  onClick?: () => void;
};

const ContextMenu = ({
  id,
  opened,
  header,
  items,
  className,
  onOpened,
  canClose = false,
  onClosed,
  position = 'bottom',
  children,
  onClick,
}: ContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isOpened, setIsOpened] = useState(opened);

  const handleClose = useCallback(() => {
    onClosed && onClosed();
    setIsOpened(false);
  }, [onClosed]);

  useOnClickOutside(ref, handleClose);

  const handleClick = useCallback(
    (e: any) => {
      console.log('handleClick');
      e.preventDefault();
      setIsOpened(prev => {
        const next = !prev;
        onOpened && onOpened(next);
        return next;
      });
      onClick && onClick();
      e.stopPropagation();
    },
    [onOpened]
  );

  return (
    <div key={id} className={clsx(css.container)}>
      {children ? (
        React.cloneElement(children, {
          onClick: handleClick,
        })
      ) : (
        <button className={css.buttonContext} onClick={handleClick}>
          <IconContextMenu />
        </button>
      )}
      {isOpened && (
        <div
          ref={ref}
          className={clsx(
            css.contextMenu,
            position && css[position],
            className && className
          )}
        >
          {canClose && (
            <div className={css.buttonClose} onClick={handleClose}>
              <img
                src="/images/icons/icon-close.svg"
                width="36"
                height="36"
                alt=""
              />
            </div>
          )}
          {header && header}
          {items &&
            items.map((item, index) => {
              if (item.hidden) return null;

              return (
                <div
                  key={`${id}-content-${index}`}
                  className={clsx(
                    css.item,
                    item.className && item.className,
                    item.separator && css.separator,
                    item.centered && css.centered
                  )}
                  onClick={(e: any) => {
                    item.onClick && item.onClick(e);
                    setIsOpened(false);
                  }}
                >
                  {item.icon && <div className={css.icon}>{item.icon}</div>}
                  <span className={css.title}>{item.title}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
