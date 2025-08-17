import css from './page.module.scss';
import MyDrafts from '../sections/MyDrafts';
import Collection from '../sections/Collection';
import { Layout, LayoutContent, LayoutSidebar } from '../layouts/Layout';
import MainHeader from '../MainHeader/MainHeader';
import React, { useState, useEffect } from 'react';
import { Cart } from '../Cart/Cart';
import { useAuth } from '../../hooks/providers/AuthProvider/AuthProvider';
import classNames from 'classnames';
import { useStateLoader } from '../../utils/draftUtils';
import ModalLogin from 'components/Home/ModalLogin';
import { shopifyLogin } from 'utils/common';
import DesignerLoginModal from './DesignerLoginModal';
import { Customer, Designer, ICollection } from 'utils/dbModels';
import { useRouter } from 'next/router';
import { useDrafts } from 'hooks/useDrafts';
import { useCollections } from 'hooks/useCollections';
import CollectionProductsRow from 'components/sections/CollectionProductsRow';
import CollectionsRow from 'components/sections/CollectionsRow';

const backgrounds = [
  "url('/headers/header1.png')",
  "url('/headers/header2.png')",
  "url('/headers/header3.png')",
  "url('/headers/header4.png')",
  "url('/headers/header5.png')",
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthorized } = useAuth();
  const isCustomer = (user instanceof Customer);
  const { create, navigateState } = useStateLoader();
  const [unauthorizedPopup, setUnauthorizedPopup] = useState(false);
  const [showDesignerLogin, setShowDesignerLogin] = useState(false);
  const { drafts, isLoadingDrafts, fetchDrafts } = useDrafts()
  const { collections, isLoadingCollections, fetchCollections } = useCollections();
  const [backgroundImage, setBackgroundImage] = useState(backgrounds[0]);

  // TODO: Remove if video adopted instead of random images
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[randomIndex]);
  }, []);

  useEffect(() => {
    const getCollections = async (params: object) => {
      await fetchCollections(params);
    }
    const fetchData = async () => {
      await fetchDrafts();
    }
    fetchData();
    if(user instanceof Designer) {
      getCollections({ user_id: user._id, published: true })
    }
    else {
      getCollections({ published: true })
    }
  }, [user]);

  const handleCreate = () => {
    if (isAuthorized) {
      create(user);
    }
    else {
      setUnauthorizedPopup(true);
    }
  };

  const handleCustomerLogin = () => {
    const user = new Customer();
    const storedUser = { ...user, type: 'Customer' }
    localStorage.setItem('ftut', JSON.stringify(storedUser));
    shopifyLogin();
  };

  const handleDesignerLogin = () => {
    setUnauthorizedPopup(false);
    setShowDesignerLogin(true);
  };

  const handleCancelLogin = () => {
    setShowDesignerLogin(false);
    setUnauthorizedPopup(false);
  };

  const handleViewCollection = (collection: ICollection) => {
    router.push({
      pathname: '/collection',
      query: { id: collection._id }
    });
  };

  return (
    <>
      <Layout>
        <LayoutSidebar 
          onUnauthorizedCreate={handleCreate} 
          onLogin={() => setUnauthorizedPopup(true)}
        />
        <LayoutContent>
          <MainHeader withLogo={false} onUnauthorizedCreate={handleCreate} />
          <div className={css.content}>
            <div className={css.header} onClick={handleCreate}>
              {' '}
              {/* style={{ backgroundImage }} */}
              <video
                className={css.videoBackground}
                src="/headerVideo175xWeb.mp4"
                autoPlay={true}
                loop={true}
                muted={true}
              />
              <div
                className={classNames({
                  [css.text]: true,
                })}
              >
                Create from scratch
              </div>
            </div>
            <div
              className={classNames({
                [css.myDrafts]: true,
                [css.visible]: isAuthorized,
              })}
            >
              {/* <MyDrafts /> */}
              <CollectionProductsRow 
                title='Recently Updated'
                items={drafts}
                isLoading={isLoadingDrafts}
                onItemClick={(draft) => navigateState(draft)}
                onViewAllClick={() => router.push('/myitems')}
              />
            </div>
            <div
              className={classNames({
                [css.collection]: true,
                [css.visible]: isAuthorized,
              })}
            >
              {/* <Collection /> */}
              {isCustomer ? 
              (
                <CollectionsRow 
                  viewingAs={user}
                  title='Latest Designer Collections'
                  collections={collections}
                  isLoading={isLoadingCollections}
                  onCollectionClick={(coll) => handleViewCollection(coll)}
                  onViewAllClick={() => router.push('/collections')}
                />
              ) : (
                <CollectionsRow 
                  title='Recent Collections (Published)'
                  collections={collections}
                  isLoading={isLoadingCollections}
                  onCollectionClick={(coll) => router.push({
                    pathname: '/create-collection',
                    query: { id: coll._id }
                  })}
                  onViewAllClick={() => router.push('/collections')}
                />
              )}
            </div>
          </div>
          {unauthorizedPopup && (
            <ModalLogin 
              opened
              onClose={()=> {setUnauthorizedPopup(false)}}
              title="Login"
              description="Login or Signup to create your products"
              onLoginCustomer={handleCustomerLogin}
              customerLoginButtonText="Customer Login"
              onLoginDesigner={handleDesignerLogin}
              designerLoginButtonText="Designer Login"
            />
          )}
          {showDesignerLogin &&
            <DesignerLoginModal onCancelLogin={handleCancelLogin} />
          }
        </LayoutContent>
      </Layout>
      <Cart />
    </>
  );
}
