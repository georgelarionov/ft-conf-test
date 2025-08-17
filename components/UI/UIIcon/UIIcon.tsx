import React, { CSSProperties, SyntheticEvent } from 'react';
import classnames, { Mapping } from 'classnames';
import _noop from 'lodash/noop';
import * as icons from './IconData';

export interface UIIconProps {
    icon: keyof typeof icons;
    onClick?: (e: SyntheticEvent) => void;
    className?: Mapping | string;
    style?: CSSProperties;
}

export const UIIcon: React.FC<UIIconProps> = ({
  icon,
  onClick = _noop,
  className,
  ...restProps
}) => {
    const Icon = icons[icon];
    return (
        <span
            className={classnames('UI__icon', className)}
            role="presentation"
            onClick={onClick}
            {...restProps}
        >
            {!!Icon && <Icon />}
        </span>
    );
};

