import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import { UIIcon, UIIconProps } from 'components/UI/UIIcon/UIIcon';

import s from './styles.module.css';
import classnames from 'classnames';

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon?: UIIconProps['icon'];
};

export const UIIconButton = ({
  icon,
  children,
  className,
  ...buttonProps
}: Props) => {
  return (
    <button {...buttonProps} className={classnames(s.iconButton, className)}>
      {!!icon && <UIIcon icon={icon} />}
      {children}
    </button>
  );
};
