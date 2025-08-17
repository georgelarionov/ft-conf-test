import css from './page.module.scss';
import { Layout, LayoutContent, LayoutSidebar } from '../../layouts/Layout';
import MainHeader from '../../MainHeader/MainHeader';
import React from 'react';
import { Cart } from '../../Cart/Cart';
import { useSidebar } from '../../../hooks/providers/SidebarProvider/SidebarProvider';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { Customer } from 'utils/dbModels';
import { CollectionItemsList } from '../CollectionItemsList/CollectionItemsList';

export default function CollectionPage() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  // const isCustomer = (user instanceof Customer);

  return (
    <>
      <Layout>
        <LayoutSidebar />
        <LayoutContent>
          <MainHeader withLogo={false} />
          <div
            className={css.content}
            style={{
              overflow: isOpen ? 'hidden' : 'overlay',
            }}
          >
            <CollectionItemsList />
          </div>
        </LayoutContent>
      </Layout>
      <Cart />
    </>
  );
}
