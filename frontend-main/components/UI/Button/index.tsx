import React, { ButtonHTMLAttributes, MouseEvent } from 'react';
import clsx from 'clsx';

import css from './button.module.scss';

export enum ButtonVariant {
  DEFAULT = 'default',
  FUNCTION = 'function',
  Round = 'round',
}

type Variant = `${ButtonVariant}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?(event: MouseEvent<HTMLButtonElement>): unknown;

  variant?: Variant;
  leftIcon?: string | any;
  centreIcon?: string | any;
  hidden?: boolean;
}

const Button = ({
  onClick,
  disabled,
  variant = ButtonVariant.DEFAULT,
  className,
  children,
  leftIcon,
  centreIcon,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      {...restProps}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        css.button,
        className,
        variant && css[`variant_${variant}`]
      )}
    >
      {leftIcon && !centreIcon && (
        <div className={css.icon}>
          {typeof leftIcon === 'string' ? (
            <img src={leftIcon} width="20" height="20" alt="" />
          ) : (
            leftIcon
          )}
        </div>
      )}
      {centreIcon ? (
        <div className={css.centreIcon}>
          {typeof centreIcon === 'string' ? (
            <img src={centreIcon} width="20" height="20" alt="" />
          ) : (
            centreIcon
          )}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
