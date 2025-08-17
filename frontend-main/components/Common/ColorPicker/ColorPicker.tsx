import React, { useEffect, useState } from 'react';
import { useMeta } from 'hooks/providers';
import {
  ColorPicker as ColorPalette,
  toColor,
  useColor,
} from 'react-color-palette';

import s from './styles.module.css';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';

export const ColorPicker = ({ initialColor, onChange }) => {
  const { isMobile } = useMeta();
  const isMobileSize = useIsMobile();
  const [state, setState] = useState({
    colorPicker: {
      width: 0,
      height: 0,
    },
  });
  const [color, setColor] = useColor('hex', initialColor);

  const handleChangeColorPickerSize = () => {
    const width = isMobile ? window.innerWidth : 339;
    setState(prev => ({
      ...prev,
      colorPicker: {
        width,
        height: width / 2,
      },
    }));
  };

  useEffect(() => {
    handleChangeColorPickerSize();
    window.addEventListener('resize', handleChangeColorPickerSize);

    return () => {
      window.removeEventListener('resize', handleChangeColorPickerSize);
    };
  }, []);

  useEffect(() => {
    onChange(color);
  }, [color]);

  useEffect(() => {
    setColor(toColor('hex', initialColor));
  }, [initialColor]);

  return (
    <div className={s.colorPicker}>
      {!!state.colorPicker.width && !!state.colorPicker.height && (
        <div className={s.pickers}>
          <div className={s.hexContainer}>
            <ColorPalette
              width={state.colorPicker.width}
              height={state.colorPicker.height}
              color={color}
              onChange={setColor}
              hideHSV
              hideHEX
              hideRGB
            />
          </div>
          <div className={s.hue}>
            <ColorPalette
              width={
                isMobile
                  ? state.colorPicker.width - 35
                  : state.colorPicker.width
              }
              color={color}
              onChange={setColor}
              hideHSV
              hideHEX
              hideRGB
            />
          </div>
        </div>
      )}
      <div className={s.actions}>
        <span className={s.hex}>Hex</span>
        <span className={s.color}>
          <span className={s.colorItem}>{color.hex}</span>
        </span>
      </div>
    </div>
  );
};
