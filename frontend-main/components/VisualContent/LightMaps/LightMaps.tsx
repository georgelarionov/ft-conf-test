import React, { useState, useRef } from 'react';
import { useSession } from 'hooks/providers';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { backgroundSamples } from 'components/BackgroundSettings/helpers';
import { BackgroundMapItem } from 'components/BackgroundSettings/BackgroundMapItem';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';

import s from './styles.module.css';
import classnames from 'classnames';
import { UIRangeSliderValues } from '../../UI/UIRangeSliderValues/UIRangeSliderValues';
import { UICheckboxRow } from "../../UI/UICheckboxRow/UICheckboxRow";
import { ModelView } from "../../ModelView/ModelView";

export const LightMaps = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { session, setSession } = useSession();
  const [state, setState] = useState({
    opened: false,
    length: 10,
    useBackground: false,
  });

  const toggleOpen = () =>
    setState(prev => ({ ...prev, opened: !prev.opened }));

  const handleClose = () => {
    setState(prev => ({ ...prev, opened: false }));
  };

  const onChange = ({ target: { value } }) => {
    setSession({ light: { ...session.light, exposition: Number(value) } });
  };

  const handleUseBackground = (active: boolean) => {
    ModelView.Instance.useBackground(active);
    setSession({ light: { ...session.light, useBackground: active } });
  };

  useOnClickOutside(containerRef, handleClose);

  return (
    <div className={`${s.lightMapsWrapper} ${className}`} ref={containerRef}>
      <span
        role="presentation"
        onClick={toggleOpen}
        className={classnames({
          [s.openAction]: true,
          [s.opened]: state.opened,
        })}
      >
        {!state.opened && 'Light'}
        {state.opened && (
          <>
            <UIIcon icon="close" />
            Close
          </>
        )}
      </span>
      {state.opened && (
        <div className={s.lightMaps}>
          <UIRangeSliderValues
            value={session.light.exposition}
            name="exposition"
            onChange={onChange}
            title="Exposition"
            min={0.1}
            max={2}
            step={0.1}
            mobileView
          />
            <UICheckboxRow
                style={{ maxWidth: 200 }}
                onChange={handleUseBackground}
                active={session.light.useBackground}
                label="Background"
                name="useBackground"
            />
          <div className={`${s.list} hideScroll`}>
            {backgroundSamples.map(({ title, renderMap, key }) => (
              <BackgroundMapItem
                key={key}
                renderMap={renderMap}
                title={title}
                mapKey={key}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
