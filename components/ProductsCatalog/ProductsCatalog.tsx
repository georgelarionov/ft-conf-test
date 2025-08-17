import React, { useEffect } from 'react';
import { ProductCatalogItem } from './ProductCatalogItem/ProductCatalogItem';

import s from './styles.module.scss';
import {
  useCategories,
  useProducts,
  useSession,
  useUser,
} from '../../hooks/providers';
import { STEPS } from '../../type';
import Button from 'components/UI/Button';
import IconUnion from '../../public/images/Union.svg';
import { useIsMobile } from '../../hooks/mobileResolutionDetect';
import useWindowDimensions from 'hooks/useWindowDemention';

export const ProductsCatalog = () => {
  const { categories } = useCategories();
  const { currentSlug, getProductList } = useProducts();

  const { goStep, currentStep } = useSession();
  const { updateUserCheckout, userCheckout } = useUser();

  const isMobileSize = useIsMobile();
  const { isTablet } = useWindowDimensions();

  const onReset = () => {
    updateUserCheckout({ productCatalog: { slug: '', name: '' } });
    getProductList('');
    goStep(STEPS.CHOSE_CATEGORY);
  };

  useEffect(() => {
    getProductList(userCheckout.productCatalog.slug);
  }, [getProductList]);

  const ButtonClear = () => {
    return (
      <div className={s.buttons}>
        <Button onClick={onReset} variant="function" leftIcon={<IconUnion />}>
          CLEAR SELECTION
        </Button>
      </div>
    );
  };

  return (
    <div className={s.catalogRoot}>
      <div className={s.catalogHeader}>
        <div>Select categories</div>
        {currentStep.step === STEPS.CHOOSE_PRODUCT && isTablet && (
          <ButtonClear />
        )}
      </div>
      <div className={`${s.productsCatalog} list scrollList`}>
        {categories.map(({ slug, title }) => (
          <ProductCatalogItem
            key={slug}
            selected={currentSlug == slug}
            title={title}
            slug={slug}
            onReset={onReset}
          />
        ))}
      </div>
      {currentStep.step === STEPS.CHOOSE_PRODUCT &&
        !isMobileSize &&
        !isTablet && <ButtonClear />}
    </div>
  );
};
