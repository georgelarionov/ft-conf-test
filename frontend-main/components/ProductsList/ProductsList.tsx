import React, { useEffect } from 'react';
import { UIProductCard } from 'components/UI/UIProductCard/UIProductCard';
import { Product } from 'type';

import s from './styles.module.css';
import { useProducts, useSession, useUser } from '../../hooks/providers';
import { categories } from "../../hooks/providers/CategoriesProvider/categories";
import { DEFAULT_AUTHOR, DEFAULT_CURRENCY_TYPE, DEFAULT_PRICE } from "../../utils/consts";
import { PRODUCT_PRICE } from 'utils/common';
import { useIsMobile } from "../../hooks/mobileResolutionDetect";

export const ProductsList = () => {
  const { setSession, nextStep } = useSession();
  const { products, getProductList, currentSlug } = useProducts();
  const { userCheckout, updateUserCheckout } = useUser();
    const isMobileSize = useIsMobile();

  const onClick = (product: Product) => () => {
    setSession({ product: product });
    updateUserCheckout({ product: product });
    nextStep();
  };

  useEffect(() => {
    getProductList(userCheckout.productCatalog.slug);
  }, [getProductList, userCheckout]);

  return (
      <>
          {!isMobileSize && (
              <div className={s.catalogHeader}>
                  Select item from {categories.find(e => e.slug === currentSlug)?.title}
              </div>
          )}
        <div className={`${s.productsList} list`}>
          {products?.map((product, i) => (
              <UIProductCard
                  key={product.slug + i}
                  // price={`from ${DEFAULT_CURRENCY_TYPE}${(product.price ?? DEFAULT_PRICE).toString()}`}
                  price={`${DEFAULT_CURRENCY_TYPE}${PRODUCT_PRICE}`}
                  author={product.author ?? DEFAULT_AUTHOR}
                  title={product.title}
                  onClick={onClick(product)}
                  image={product.image}
              />
          ))}
        </div>
      </>
  );
};
