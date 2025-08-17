import React, { useEffect, useState } from 'react';
import { useMeta, useSession } from 'hooks/providers';
import { PrintMapCanvas } from '../../ModelView/PrintMap/PrintMapCanvas';
import { PrintListCarousel } from '../PrintListCarousel/PrintListCarousel';
import { PrintColorSettings } from '../PrintColorSettings/PrintColorSettings';

import s from './styles.module.css';
import { UIRangeSliderValues } from '../../UI/UIRangeSliderValues/UIRangeSliderValues';
import { ModelView } from '../../ModelView/ModelView';
import { EditMode } from '../../ModelView/View/ModelView.types';
import { PrintCanvas } from '../PrintCanvas/PrintCanvas';
import { UniversalImageLoader } from '../../../utils/universalImageLoader';
import { PrintFileType } from '../../../type/print';

export const PrintsList = () => {
  const { session, setSession } = useSession();
  const { isMobile } = useMeta();
  const [currentPrintType, setCurrentPrintType] = useState<PrintFileType>();
  // Инициализируем цвет из сессии, если есть
  const initialColor = session.prints?.[0]?.color || '#000000';
  const [currentPrintColor, setCurrentPrintColor] = useState<string>(initialColor);

  const changeOpacity = ({ target: { value } }) => {
    const val = parseInt(value);

    console.log(value);
    setSession({
      prints: session.prints?.map(print => ({ ...print, opacity: val })),
    });

    const printIds = PrintMapCanvas.Instance.printIds;
    // let printItem = printIds.get(img);
    // printItem?.wantOpacity((val / 100));
  };

  useEffect(() => {
    ModelView.Instance.setEditMode(EditMode.Print);
    
    // Сохраняем текущие цвета принтов перед обновлением из ModelView.lastState
    const currentColors = session.prints?.reduce((acc, print) => ({
      ...acc,
      [print.image]: print.color
    }), {}) || {};
    
    // Обновляем принты из ModelView.lastState, но сохраняем цвета
    const updatedPrints = ModelView.lastState.prints.map(print => ({
      ...print,
      color: currentColors[print.image] || undefined
    }));
    
    setSession({ prints: updatedPrints })

    return () => {
      ModelView.Instance.setEditMode(EditMode.None);
    }
  }, []);

  useEffect(() => {
    // Определяем тип текущего принта
    const currentPrint = session.prints?.[0];
    if (currentPrint?.image) {
      const fileType = UniversalImageLoader.getFileType(currentPrint.image);
      setCurrentPrintType(fileType);
      
      // Если это SVG, синхронизируем цвет
      if (fileType === PrintFileType.VECTOR) {
        const printItem = PrintMapCanvas.Instance?.printIds.get(currentPrint.image);
        
        // Приоритет: 1) цвет из сессии, 2) цвет из PrintMapItem, 3) дефолтный
        const colorToUse = currentPrint.color || printItem?.getColor() || '#000000';
        setCurrentPrintColor(colorToUse);
        
        // Если PrintMapItem существует и его цвет отличается, обновляем его
        if (printItem && currentPrint.color && printItem.getColor() !== currentPrint.color) {
          printItem.updateColor(currentPrint.color);
        }
      }
    }
  }, [session.prints]);

  const handleColorChange = (color: string) => {
    setCurrentPrintColor(color);
    
    // Обновляем цвет текущего SVG принта
    const currentPrint = session.prints?.[0];
    if (currentPrint?.image) {
      const printItem = PrintMapCanvas.Instance?.printIds.get(currentPrint.image);
      if (printItem) {
        printItem.updateColor(color);
      }
    }
    
    // Сохраняем цвет в сессии
    setSession({
      prints: session.prints?.map(print => ({ 
        ...print, 
        color: print.image === currentPrint?.image ? color : print.color 
      })),
    });
  };

  const { prints = [] } = session;

  return (
      <div className={`${s.printList} list hideScroll`}>
        {/* Настройки цвета для SVG */}
        <PrintColorSettings
          fileType={currentPrintType}
          currentColor={currentPrintColor}
          onColorChange={handleColorChange}
        />
        
        {/*<div className={s.printSettings}>*/}
        {/*  <div className={s.opacityContent}>*/}
        {/*    <UIRangeSliderValues*/}
        {/*        title="Transparency"*/}
        {/*        value={(prints[0]?.opacity || 1)}*/}
        {/*        onChange={(e) => changeOpacity(e)}*/}
        {/*        name="transparency"*/}
        {/*        min={1}*/}
        {/*        max={100}*/}
        {/*        step={1}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        {<PrintListCarousel/>}
        <PrintCanvas image={prints[0]?.image || ''} opacity={prints[0]?.opacity || 0} />
      </div>
  );
};
