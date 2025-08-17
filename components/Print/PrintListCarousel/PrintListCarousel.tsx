import React, { useState, useEffect } from 'react';
import {
  PrintUpload,
  CUSTOM_LOADED_IMAGE_ID,
} from 'components/Print/PrintUpload/PrintUpload';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { UICard } from 'components/UI/UICard/UICard';
import { HScroll } from 'components/Common/HScroll/HScroll';
import { PrintMapCanvas } from "../../ModelView/PrintMap/PrintMapCanvas";
import { PrintMapItem } from "../../ModelView/PrintMap/PrintMapItem";
import { ModelView } from "../../ModelView/ModelView";
// MOCK
import { prints, adaptUserPrints } from '../PrintsList/helpers';
import { useSession, useUser } from 'hooks/providers';

import s from './styles.module.css';
import { UICheckmark } from "../../UI/UICheckmark/UICheckmark";
import { UIPrintCard } from "../../UI/UIPrintCard/UIPrintCard";
import { UISimpleCard } from "../../UI/UISimpleCard/UISimpleCard";
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { loadPrints } from 'utils/endpoints/endpoints';
import { UsersPrintsStatuses } from 'utils/common';
import { UniversalImageLoader } from '../../../utils/universalImageLoader';
import { PrintFileType } from '../../../type/print';

type TPrint = {
  id: string;
  invert?: boolean;
  image: string;
};

export const PrintListCarousel = () => {
  const { session, setSession } = useSession();
  const { userCheckout } = useUser();
  // TODO: Update using allPrints?
  const [initialIndex] = useState(() => {
    const index = prints.findIndex(print =>
        (userCheckout.prints || []).find(({ id }) => id === print.id)
      ) || 0;
    return index ? index + 1 : 0; // index + 1 - Minus PrintUpload child
  });
  const { user } = useAuth();
  const [allPrints, setAllPrints] = useState<TPrint[]>([]);

  useEffect(()=> {
    const fetchCustomPrints = async () => {
      const customPrintsResponse = await loadPrints({ user_id: user?._id, status: UsersPrintsStatuses.APPROVED });
      if (customPrintsResponse?.data.success) {
        const customPrints = customPrintsResponse?.data.prints;
        const adaptedCustomPrints = adaptUserPrints(customPrints);
        setAllPrints([...prints, ...adaptedCustomPrints]);
      }
    };
    fetchCustomPrints();
  }, [user])

  const onImageChoose = (image: string) => async () => {
    const { prints = [] } = session;
    const existImage = prints.find(print => print.image === image);
    const opacity = 1; // prints?.[0]?.opacity || 0.5;
    const printMapItem = new PrintMapItem();
    
    // Определяем тип файла и сохраняем текущий цвет или устанавливаем по умолчанию для SVG
    const fileType = UniversalImageLoader.getFileType(image);
    // Если у нас уже есть этот принт в сессии, сохраняем его цвет
    const existingColor = existImage?.color;
    const defaultColor = fileType === PrintFileType.VECTOR ? (existingColor || '#000000') : undefined;

    setSession({
      prints: existImage
        ? session.prints.filter(print => print.image !== image)
        : [...(session.prints || []), { image, opacity, printMapItem, color: defaultColor }],
    });

    // add
    if (image != '' && existImage == null)
    {
      await PrintMapCanvas.Instance.tryAddItem(printMapItem, image, 1, null, null, null, defaultColor);
    }
    // remove
    if (image != '' && existImage != null)
    {
      PrintMapCanvas.Instance.removePrintItem(image);
    }

    ModelView.Instance.readState()
  };

  const uploadedImage = session.prints?.find(
    ({ id }) => id === CUSTOM_LOADED_IMAGE_ID
  );

  const preload =() => {

    console.log('preload prints')

    // preload chosen prints into canvas
    allPrints.map(async ({ image, id }) =>
    {
      const printData = ModelView.lastState.prints.find(e=> e.image.includes(image))

      if (printData)
      {
        setTimeout(async ()=>{
            if (PrintMapCanvas.Instance.canAddItem(image))
            {
              console.log(printData);

              const item = new PrintMapItem();
              
              // Получаем цвет из текущей сессии, если есть
              const sessionPrint = session.prints?.find(p => p.image === image);
              
              const color = sessionPrint?.color || undefined;
              
              console.log(`Loading print ${image} with color:`, color);

              await PrintMapCanvas.Instance.tryAddItem(item, image, printData.opacity, printData.position, printData.scale, printData.rotation, color);
              PrintMapCanvas.Instance?.update(0);
              ModelView.Instance.needsUpdate()
            }
        }, 300);
      }

    });
  }

  useEffect(() => {
    preload();
  }, [session.prints]); // Перезагружаем принты при изменении сессии
  
  return (
    <HScroll className={s.printListCarousel} index={initialIndex}>
      {[
        /*<PrintUpload
          key="printUpload"
          onImageClick={onImageChoose}
          image={uploadedImage ? uploadedImage.image : undefined}
        >
          {!!uploadedImage && <UIIcon icon="check" className={s.checkIcon} />}
        </PrintUpload>,*/
        ...allPrints.map(({ image, id, invert }, i) => {
          const isChosen = session?.prints?.find(print => print.image === image);
          return (
            <UISimpleCard
                key={id}
                blackBack={invert}
                className={s.printListItem}
                centerImg={true}
                title={""}
                selected={!!isChosen}
                onClick={onImageChoose(image)}
                image={image}
            />
          );
        }).reverse(),
      ]}
    </HScroll>
  );
};
