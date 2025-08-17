import css from './page.module.scss';
import { Layout, LayoutContent, LayoutSidebar } from '../layouts/Layout';
import MainHeader from '../MainHeader/MainHeader';
import React from 'react';
import { Cart } from '../Cart/Cart';
import { MyItemsList } from '../MyItemsList/MyItemsList';
import { useSidebar } from '../../hooks/providers/SidebarProvider/SidebarProvider';

export default function MyItemsPage() {
  const { isOpen } = useSidebar();

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
            <MyItemsList />
            <Cart />
          </div>
        </LayoutContent>
      </Layout>
      <Cart />
    </>
  );
}
