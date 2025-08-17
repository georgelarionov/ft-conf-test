import s from './styles.module.scss';
import p from '../VideoCreate/DownloadPopup/ProcessingPopup/styles.module.css';
import { UIIcon } from '../UI/UIIcon/UIIcon';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useCart } from '../../hooks/providers/CartProvider/CartProvider';
import Button from 'components/UI/Button';

// import IconSize from '../../public/images/icon-cart-size.svg';
// import IconQuantity from '../../public/images/icon-cart-quantity.svg';
import { Product } from 'type';
import { getProductImage } from 'utils/productUtils';
import { FTProduct } from 'utils/dbModels';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import * as endpoints from 'utils/endpoints/endpoints';
import Loader from 'components/UI/Loader';
import { ModelView } from 'components/ModelView/ModelView';
import { PRODUCT_PRICE, getErrorMessage } from 'utils/common';
import { useMeta } from '../../hooks/providers';
import css from '../layouts/Layout/auth.module.scss';
import { IconClose } from '../UI/UIIcon/IconData';
import { useIsMobile } from '../../hooks/mobileResolutionDetect';

const CHECK_PURCHASED_INTERVAL = 16000;

const { customerCheckout } = endpoints.Customers;

export const Cart = () => {
  const { user } = useAuth();
  const { visible, updateCartState, cart, setCart } = useCart();
  const [waitingForCheckout, setWaitingForCheckout] = useState(false);
  const [error, setError] = useState('');
  const isMobileSize = useIsMobile();

  let subtotal = 0;

  // useEffect(() => {
  //   if(visible && waitingForPurchased) {
  //     const checkPurchasedInterval = setInterval(async () => {
  //       console.log('Check Purchased');
  //     }, CHECK_PURCHASED_INTERVAL);

  //     // Cleanup function to clear the interval when the component unmounts
  //     return () => {
  //       console.log('Cart Unmounted Stop Checking Purchased');
  //       clearInterval(checkPurchasedInterval);
  //     };
  //   }
  // }, [visible, waitingForPurchased]);

  const handleCheckout = async () => {
    const checkoutProducts = cart.map(cartItem => {
      return { _id: cartItem.ftProduct._id, title: cartItem.product.title };
    });
    console.log('Checkout: ' + JSON.stringify(checkoutProducts));
    setError('');
    setWaitingForCheckout(true);
    try {
      const checkoutResponse = await customerCheckout(checkoutProducts);
      // console.log("Checkout Response:"+checkoutResponse);
      if (checkoutResponse.data.success) {
        const checkout_url = checkoutResponse.data.checkout_url;
        // console.log("Checkout Response URL:"+checkout_url);
        window.location.replace(checkout_url);
        // setWaitingForCheckout(false);
      } else {
        setWaitingForCheckout(false);
        setError(checkoutResponse.data.message);
      }
    } catch (error) {
      setWaitingForCheckout(false);
      setError(getErrorMessage(error));
    }
  };

  const handleDelete = (cartItem: any) => {
    setCart((prev: any) => {
      return prev.filter((item: any) => item !== cartItem);
    });
  };

  return (
    <div
      className={classNames({
        [s.base]: true,
        [s.showed]: visible,
      })}
    >
      <div
        className={s.background}
        onClick={() => updateCartState(false)}
      ></div>

      <div className={s.cart}>
        <div className={s.header}>
          <p>
            Your cart
            {cart?.length > 0 && (
              <span className={s.itemsCount}>
                <span className={s.count}>{cart.length}</span> items
              </span>
            )}
          </p>
          {isMobileSize ? (
            <button
              className={s.closeCart}
              onClick={() => updateCartState(false)}
              aria-label="Close sidebar"
            >
              <IconClose />
            </button>
          ) : (
            <UIIcon
              icon="close"
              className={p.close}
              onClick={() => updateCartState(false)}
            />
          )}
        </div>
        {cart?.length > 0 && (
          <>
            <div className={s.content}>
              {cart.map((cartItem: any, index: number) => {
                const product = cartItem.product as Product;
                const ftProduct = cartItem.ftProduct as FTProduct;
                const productTitle = product.title;
                const productAuthor = user?.first_name ?? product.author;
                const productPrice = PRODUCT_PRICE; // product.price ?? 20;
                let productImage = getProductImage(ftProduct);
                if (!productImage) {
                  productImage = product.image;
                }

                subtotal += productPrice;

                return (
                  <div className={s.item} key={`cart-item-${index}`}>
                    <div className={s.buttonDelete}>
                      <UIIcon
                        icon={'trash'}
                        onClick={() => handleDelete(cartItem)}
                        className={s.iconTrash}
                      />
                    </div>
                    <div className={s.image}>
                      {productImage && <img src={productImage} alt="" />}
                    </div>
                    <div className={s.about}>
                      <div className={s.title}>{productTitle}</div>
                      <div className={s.author}>{productAuthor}</div>
                      <div className={s.price}>${productPrice}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={s.subTotal}>
              <div>Subtotal:</div>
              <div>${subtotal}</div>
            </div>
            {!waitingForCheckout && (
              <div className={s.buttonSubmit}>
                <Button onClick={handleCheckout} variant="function">
                  Proceed to checkout
                </Button>
              </div>
            )}
            {waitingForCheckout && (
              <div className={s.checkingOut}>
                <span>Waiting for checkout...</span>
                <Loader />
              </div>
            )}
            {error.length > 0 && <div className={s.error}>{error}</div>}
          </>
        )}
        {/* <div className={s.footer}>
          <div className={s.notice}>
            <div className={s.title}>
              You will be able to choose size on the next step
            </div>
            <div className={s.icon}>
              <IconSize />
            </div>
          </div>
          <div className={s.notice}>
            <div className={s.title}>
              You will be able to choose quantity on the next step
            </div>
            <div className={s.icon}>
              <IconQuantity />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
