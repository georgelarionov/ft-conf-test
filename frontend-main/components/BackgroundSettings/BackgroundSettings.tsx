import React, { useEffect } from 'react';
import { useSession, useUser } from 'hooks/providers';
import { UIRangeSliderValues } from 'components/UI/UIRangeSliderValues/UIRangeSliderValues';
import { ModelView } from '../ModelView/ModelView';
import { BackgroundMapItem } from './BackgroundMapItem';

import { backgroundSamples } from './helpers';

import s from './styles.module.css';
import { UICheckbox } from "../UI/UICheckbox/UICheckbox";

export const BackgroundSettings = () => {
  const { setSession, session } = useSession();
  const { userCheckout } = useUser();

  const onChangeExposition = ({ target: { value } }) => {
    setSession({
      light: { ...session.light, exposition: Number(value) },
    });
  };

  const onChange = (value: boolean, name: string) => {
    setSession({
      light: { ...session.light, [name]: value },
    });
  };

  const onChangeRenderMap = (renderMap: string) => async () => {
    setSession({
      light: { ...session.light, renderMap },
    });
    await ModelView.Instance.loadBackground(renderMap);
  };

  useEffect(() => {
    setSession({
      light: { ...session.light, ...userCheckout.light },
    });
  }, []);

  const handleUseBackground = (active: boolean) => {
    ModelView.Instance.useBackground(active);
    setSession({ light: { ...session.light, useBackground: active } });
  };

  const {
    light: {
      exposition,
      useBackground,
      renderMap: chosenMap,
    } = {},
  } = session;

  return (
    <div className={`${s.productsCatalog}`}>
      <div className={s.inputs}>
        <UIRangeSliderValues
            title="Exposition"
            value={exposition}
            onChange={onChangeExposition}
            name="exposition"
            min={0}
            max={2}
            step={0.01}
        />
        <div className={s.checkbox}>
          <span className={s.checkboxName}>Background</span>
          <UICheckbox
              onChange={handleUseBackground}
              name="useBackground"
              active={useBackground}
          />
        </div>
      </div>
      {backgroundSamples.map(({ title, renderMap, key }) => (
          <BackgroundMapItem
              key={key}
              renderMap={renderMap}
              title={title}
              mapKey={key}
              chosen={chosenMap === key}
          />
      ))}
    </div>
  );
};
