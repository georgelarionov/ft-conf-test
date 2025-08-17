import React from 'react';
import classnames from 'classnames';
import s from './styles.module.css';

type Props = {
  children: any;
  className?: string;
  borderContent?: boolean;
  listElement?: boolean;
  onClick?: () => void; 
  disabled?: boolean
  selected?: boolean
};

export const UICard: React.FC<Props> = ({
  disabled = false,
  selected = false,
  className = '',
  onClick = () => {},
  children,
  borderContent,
  listElement,
}) => {
  return (
    <div
      onClick={disabled ? ()=>{} : onClick}
      className={classnames(className, {
        [s.card]: true,
        [s.borderContent]: borderContent,
        [s.listElement]: listElement,
        [s.disabled]: disabled,
        [s.selected]: selected
      })}
    >
      <div className={s.content}>{children}</div>
    </div>
  );
};
