import React, { useEffect, useState } from 'react';
import { MainActions } from 'components/MainActions/MainActions';
import { VisualContent } from 'components/VisualContent/VisualContent';

import s from 'components/MainPage/styles.module.css';
import Version from '../components/Version/Version';
import MainHeader from '../components/MainHeader/MainHeader';
import { Cart } from 'components/Cart/Cart';
import Loader from 'components/UI/Loader';
import { useStateLoader } from '../utils/draftUtils';
import { ModelView } from '../components/ModelView/ModelView';
import { useAuth } from '../hooks/providers/AuthProvider/AuthProvider';
import * as endpoints from '../utils/endpoints/endpoints';
import { Designer, FTProduct } from '../utils/dbModels';
import ModalConfirm from 'components/UI/ModalConfirm';
import { useRouter } from 'hooks/useRouter';
import { useIsMobile } from '../hooks/mobileResolutionDetect';
import {
  Layout,
  LayoutContent,
  LayoutSidebar,
} from '../components/layouts/Layout';
import { useSession } from '../hooks/providers';
import { StepContent } from '../components/MainActions/ActionContent/ActionContent';
import { STEPS } from 'type';
import useWindowDimensions from 'hooks/useWindowDemention';

// const { loadDrafts } = endpoints.Customers;
const { loadProduct } = endpoints;

export default function Product() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDraftExist, setIsDraftExist] = useState(true);
  const { loadState } = useStateLoader();
  const [isLoading, setIsLoading] = useState(true);
  const [nosavePopup, setNoSavePopup] = useState(false);
  const isMobileSize = useIsMobile();
  const { updateAuthState } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);
  const { isTablet } = useWindowDimensions();
  const { currentStep } = useSession();

  useEffect(() => {
    const func = async () => {
      const id = new URLSearchParams(window.location.search).get('id');
      if (!id) {
        setIsDraftExist(false);
        setIsLoading(false);
        return;
      }

      // console.log('product.tsx:', ModelView.Product);

      if (ModelView.Product?._id === id) {
        setIsDraftExist(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        return;
      }

      const draftResponse = await loadProduct(id);
      const draft = draftResponse?.data?.ftproduct;

      if (!draft) {
        setIsDraftExist(false);
        setIsLoading(false);
        return;
      }
      setIsDraftExist(true);
      await loadState(draft);
      setIsLoading(false);
    };
    func();
  }, []);

  useEffect(() => {
    const isDesigner = user instanceof Designer;
    const isProductPurchased = ModelView?.Product?.purchased;
    const isUserOriginalProductOwner =
      ModelView?.Product?.original_owner === user?._id;
    const can_edit = isDesigner
      ? isUserOriginalProductOwner
      : isUserOriginalProductOwner && !isProductPurchased;
    setCanEdit(can_edit);
  }, [user]);

  // let canEdit = false;

  const handleNoSavePopup = () => {
    setNoSavePopup(true);
  };

  const handleConfirmNoSave = () => {
    setNoSavePopup(false);
    router.push('/');
  };

  const handleCancelNoSave = () => {
    setNoSavePopup(false);
  };

  return isMobileSize ? (
    <Layout>
      <LayoutSidebar />
      <LayoutContent>{renderContent()}</LayoutContent>
    </Layout>
  ) : (
    renderContent()
  );

  function renderContent() {
    return (
      <div className={s.basePage}>
        <MainHeader withLogo={true} onNoSavePopup={handleNoSavePopup} />
        <div className={s.homePage}>
          <div className={s.content}>
            {isLoading ? (
              <Loader centered={true} />
            ) : isDraftExist ? (
              <MainActions />
            ) : null}
            {!isMobileSize && <Version />}
          </div>
          {isLoading ? (
            <Loader centered={true} />
          ) : isDraftExist ? (
            <VisualContent className={s.visualDesktop} />
          ) : (
            <div className={s.line3}>Product not exist</div>
          )}
          {isMobileSize && currentStep.step !== STEPS.SETTINGS && (
            <div className={s.compContentMobile}>
              <StepContent step={currentStep.step} />
            </div>
          )}
          <Cart />
        </div>
        {nosavePopup && (
          <ModalConfirm
            title="Unsaved Changes"
            description="You may have unsaved changes, are you sure?"
            opened
            confirmButtonText="Yes"
            onConfirm={handleConfirmNoSave}
            onClose={handleCancelNoSave}
          />
        )}
      </div>
    );
  }
}
