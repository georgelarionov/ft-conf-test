import css from './page.module.scss';
import { Layout, LayoutContent, LayoutSidebar } from '../../layouts/Layout';
import MainHeader from '../../MainHeader/MainHeader';
import React from 'react';
import { Cart } from '../../Cart/Cart';
import { useSidebar } from '../../../hooks/providers/SidebarProvider/SidebarProvider';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { Customer } from 'utils/dbModels';
import { PublishedCollections } from '../PublishedCollections/page';
import { DesignerCollections } from '../DesignerCollections/page';

export default function AllCollectionsPage() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const isCustomer = (user instanceof Customer);

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
            {isCustomer ? (
              <PublishedCollections />
            ) : (
              <DesignerCollections />
            )}
          </div>
        </LayoutContent>
      </Layout>
      <Cart />
    </>
  );
}
