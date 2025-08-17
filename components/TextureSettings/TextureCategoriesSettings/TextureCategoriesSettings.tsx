import React, { useState } from 'react';
import { useSession } from 'hooks/providers';
import { UICard } from 'components/UI/UICard/UICard';
import { STEPS } from 'type';
import { texturesSamples } from '../texturesSamples';

import s from '../../ProductsList/styles.module.css';

export const TextureCategoriesSettings = () => {
  const { setSession, goStep } = useSession();
  const [state] = useState({
    categories: Object.entries(texturesSamples).map(([key, { title }]) => ({
      key,
      title,
    })),
  });

  const onChooseCategory = category => () => {
    setSession({ texture: category });
    goStep(STEPS.TEXTURES);
  };

  return (
    <div className={`${s.productsCatalog} list hideScroll`}>
      {state.categories.map(({ title, key }) => (
        <UICard key={key} onClick={onChooseCategory(key)} borderContent>
          {title}
        </UICard>
      ))}
    </div>
  );
};
