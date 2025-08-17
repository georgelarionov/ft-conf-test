import { useRef, useState } from 'react';

import css from './slidebutton.styles.module.scss';
import clsx from 'clsx';
import { IconDropdown } from '../UIIcon/IconData';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { isTablet } from 'react-device-detect';
import useWindowDimensions from 'hooks/useWindowDemention';

type Props = {
  icon?: any;
  children: any;
  items?: any;
  className?: any;
  open?: boolean;
  active?: boolean;
};

const SlideButton = ({
  icon,
  items,
  children,
  className,
  open,
  active = true,
}: Props) => {
  const [opened, setOpened] = useState(!!open);
  const [activated, setActivated] = useState(active);
  const ref = useRef<HTMLDivElement>(null);
  const { isTablet } = useWindowDimensions();

  const handleClick = () => {
    setOpened(prev => !prev);
  };

  useOnClickOutside(ref, () => {
    if (isTablet) {
      setOpened(false);
    }
  });

  return (
    <div className={clsx(activated && css.slideButton, className && className)}>
      <div
        className={clsx(
          css.inner,
          opened && items && items.length > 0 ? css.opened : css.closed
        )}
        onClick={handleClick}
      >
        {icon && <div className={css.icon}>{icon}</div>}
        <div className={css.content}>{children}</div>
        <div
          className={clsx(
            css.arrow,
            opened && items && items.length > 0 && css.opened
          )}
        >
          {opened && items && items.length > 0 && <IconDropdown />}
        </div>
      </div>
      {opened && items && items.length > 0 && (
        <div className={css.back} ref={ref}>
          {items &&
            items.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={css.item}
                  onClick={() => {
                    item.onClick && item.onClick();
                    if (isTablet) {
                      setOpened(false);
                    }
                  }}
                >
                  {item.title}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SlideButton;
