import React, { CSSProperties } from 'react';
import { UICheckbox } from '../UICheckbox/UICheckbox';

import s from './styles.module.css';

export type UICheckboxRowProps = {
  onChange: (active: boolean, name: string) => void;
  active: boolean;
  name?: string;
  label: string;
  style?: CSSProperties
};

export const UICheckboxRow = ({
  onChange,
  active,
  name,
  label,
  style,
}: UICheckboxRowProps) => {
  return (
    <div style={style} className={s.checkbox}>
      <span className={s.checkboxName}>{label}</span>
      <UICheckbox onChange={onChange} name={name} active={active} />
    </div>
  );
};
