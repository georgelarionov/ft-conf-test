import { createContext, useState, useContext } from 'react';
import { UserCheckout } from 'type';
import { bool } from 'prop-types';

const CartContext = createContext<{
  visible: boolean;
  updateCartState: (visible: boolean) => void;
  cart: Record<string, any>[];
  setCart: (state: any) => void;
}>({
  visible: false,
  updateCartState: () => {},
  cart: [],
  setCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [state, setState] = useState({
    visible: false,
  });
  const [cart, setCart] = useState([]);

  const updateCartState = (visible: boolean) => {
    setState(prev => ({
      ...prev,
      visible: visible,
    }));
  };

  return (
    <CartContext.Provider
      value={{
        visible: state.visible,
        updateCartState,
        cart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
