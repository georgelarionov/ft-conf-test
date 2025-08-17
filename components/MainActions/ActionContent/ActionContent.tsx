import { useMemo } from 'react';
import { ProductsCatalog } from 'components/ProductsCatalog/ProductsCatalog';
import { ProductsList } from 'components/ProductsList/ProductsList';
import { Settings } from 'components/Settings/Settings';
import { ColorSettings } from 'components/ColorSettings/ColorSettings';
import { PrintsList } from 'components/Print/PrintsList/PrintsList';
import { VideoCreate } from 'components/VideoCreate/VideoCreate';
import { TextureSettings } from 'components/TextureSettings/TextureSettings';
import { TextureCategoriesSettings } from 'components/TextureSettings/TextureCategoriesSettings/TextureCategoriesSettings';
import { BackgroundSettings } from 'components/BackgroundSettings/BackgroundSettings';
import { useSession } from 'hooks/providers';
import { STEPS } from 'type';

import s from './styles.module.css';

export const ActionContent = () => {
  const { currentStep } = useSession();

  const Component = useMemo(() => {
    switch (currentStep.step) {
      case STEPS.CHOSE_CATEGORY:
      case STEPS.CHOOSE_PRODUCT:
        return <ProductsCatalog />;
      case STEPS.SETTINGS:
      case STEPS.ADD_COLOR:
      case STEPS.CHOOSE_PRINT:
      case STEPS.CREATE_VIDEO:
      case STEPS.TEXTURES:
      case STEPS.TEXTURES_CATALOG:
      case STEPS.LIGHT:
        return <Settings />;
      default:
        return null;
    }
  }, [currentStep.step]);

  return <div className={`${s.actionContent} scrollList`}>{Component}</div>;
};

export const StepContent = ({ step }: { step: STEPS }) => {
  const comp = useMemo(() => {
    return StepComponent(step);
  }, [step]);
  return <div className={s.compContent}>{comp}</div>;
};

function StepComponent(step: STEPS) {
  switch (step) {
    case STEPS.ADD_COLOR:
      return <ColorSettings />;
    case STEPS.CHOOSE_PRINT:
      return <PrintsList />;
    case STEPS.CREATE_VIDEO:
      return <VideoCreate />;
    case STEPS.TEXTURES:
      return <TextureSettings />;
    case STEPS.LIGHT:
      return <BackgroundSettings />;
    default:
      return null;
  }
}
