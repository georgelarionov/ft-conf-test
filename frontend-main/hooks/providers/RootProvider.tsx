import { CategoriesProvider } from './CategoriesProvider/CategoriesProvider';
import { MetaProvider } from './MetaProvider/MetaProvider';
import { SessionProvider } from './SessionProvider/SessionProvider';
import { ProductsProvider } from './ProductsProvider/ProductsProvider';
import { UserProvider } from './UserCheckoutProvider/UserCheckoutProvider';
import { ModelViewProvider } from './ModelViewProvider/ModelViewProvider';
import { CartProvider } from './CartProvider/CartProvider';
import { AuthProvider } from './AuthProvider/AuthProvider';
import ThemeProvider from './ThemeProvider/ThemeProvider';

export const RootProvider = ({ children, userAgent }) => {
  return (
    <ThemeProvider>
      <CategoriesProvider>
        <MetaProvider userAgent={userAgent}>
          <SessionProvider>
            <ProductsProvider>
              <UserProvider>
                <CartProvider>
                  <AuthProvider>
                    <ModelViewProvider>{children}</ModelViewProvider>
                  </AuthProvider>
                </CartProvider>
              </UserProvider>
            </ProductsProvider>
          </SessionProvider>
        </MetaProvider>
      </CategoriesProvider>
    </ThemeProvider>
  );
};
