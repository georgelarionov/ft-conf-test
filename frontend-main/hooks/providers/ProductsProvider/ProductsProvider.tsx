import { createContext, useContext, useState } from 'react';
import { Product } from 'type';
import { products } from './products';

const ProductsContext = createContext<{
  products: Product[];
  currentSlug: string;
  getProductList: (catalogSlug: string) => void;
}>({
  products: [],
  currentSlug: '',
  getProductList: () => {},
});

export const ProductsProvider = ({ children }) => {
  const [state, setState] = useState({
    products: [] as Product[],
    currentSlug: '',
  });

  const getProductList = (catalogSlug: string) => {
    if (state.currentSlug === catalogSlug) return;
    setState(prev => ({
      ...prev,
      products: products[catalogSlug],
      currentSlug: catalogSlug,
    }));
  };

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        currentSlug: state.currentSlug,
        getProductList,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
