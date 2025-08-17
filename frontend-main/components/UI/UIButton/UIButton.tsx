import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import classnames from 'classnames';

import s from './styles.module.scss';

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const UIButton: React.FC<Props> = ({
  children,
  className,
  ...buttonProps
}) => {
  return (
    <button
      className={classnames(`${s.button} UI__button`, className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
