import React from 'react';
import { colors } from 'components/ColorSettings/helpers';
import { PrintFileType } from 'type/print';
import s from './styles.module.scss';

interface PrintColorSettingsProps {
  fileType?: PrintFileType;
  currentColor?: string;
  onColorChange: (color: string) => void;
}

export const PrintColorSettings: React.FC<PrintColorSettingsProps> = ({
  fileType,
  currentColor = '#000000',
  onColorChange
}) => {
  // Показываем настройки только для SVG
  if (fileType !== PrintFileType.VECTOR) {
    return null;
  }
  
  const handleColorSelect = (color: string) => {
    onColorChange(color);
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onColorChange(color);
  };
  
  return (
    <div className={s.colorSettings}>
      <h4 className={s.title}>Print color</h4>
      
      <div className={s.presetColors}>
        {colors.map((color, index) => (
          <button
            key={index}
            className={`${s.colorButton} ${currentColor === color ? s.active : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`Выбрать цвет ${color}`}
          />
        ))}
      </div>
      
      <div className={s.customColor}>
        <label htmlFor="custom-color">Custom color:</label>
        <input
          id="custom-color"
          type="color"
          value={currentColor}
          onChange={handleCustomColorChange}
          className={s.colorInput}
        />
        <span className={s.colorValue}>{currentColor}</span>
      </div>
    </div>
  );
}; 