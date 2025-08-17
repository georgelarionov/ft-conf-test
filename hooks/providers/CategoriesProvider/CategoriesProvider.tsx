import { createContext, useContext, useState } from 'react';
import { Category } from 'type';
import { categories } from './categories';

const CategoriesContext = createContext<{
  categories: Category[];
}>({
  categories: categories,
});

export const CategoriesProvider = ({ children }) => {
  const [state, setState] = useState({
    categories: categories,
  });

  return (
    <CategoriesContext.Provider
      value={{
        categories: state.categories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
