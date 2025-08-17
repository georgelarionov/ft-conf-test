import React, { useEffect, useState } from 'react';

import s from './styles.module.scss';
import { DEFAULT_CURRENCY_TYPE } from '../../utils/consts';
import { useAuth } from '../../hooks/providers/AuthProvider/AuthProvider';
import { Designer, FTProduct } from '../../utils/dbModels';
import * as endpoints from '../../utils/endpoints/endpoints';
import { UIDraftCard } from '../UI/UIDraftCard/UIDraftCard';
// import Link from 'next/link';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { getProductDate, getProductImage } from '../../utils/productUtils';
import ModalConfirm from 'components/UI/ModalConfirm';
import { useDrafts } from '../../hooks/useDrafts';
import { useLibrary } from '../../hooks/useLibrary';
import { useStateLoader } from '../../utils/draftUtils';
// import { PRODUCT_PRICE } from 'utils/common';
import SegmentedControl from 'components/UI/SegmentedControl/SegmentedControl';
// import { loadDrafts } from 'utils/endpoints/endpoints-debug-customer';
import IconTop from '../../public/images/ToTop.svg';
import css from '../Signup/signup.module.scss';
import ModalAlert from 'components/UI/ModalAlert';

const ItemSegments = {
  DRAFTS: 'drafts',
  LIBRARY: 'purchases',
  COLLECTIONS: 'collections'
}
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { getErrorMessage } from 'utils/common';

export const MyItemsList = () => {
  const { user, updateMenuDrafts } = useAuth();
  const { deleteDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
  const { restorePurchases } = endpoints.Customers;
  const [deletingDraft, setDeletingDraft] = useState<FTProduct | null>(null);

  const [showToTop, setShowToTop] = useState(false);

  const [deleteDraftModal, setDeleteDraftModal] = useState<any>(null);
  const [openModalRestoringPurchase, setOpenModalRestoringPurchase] =
    useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState<any>(null);
  // const { collections } = useAuth();

  const isDesigner = (user instanceof Designer);

  const {
    drafts,
    setDrafts,
    fetchDrafts,
    isLoadingDrafts,
    setIsLoadingDrafts,
    hasMore,
    loadMoreDrafts,
    isLoadingMore
  } = useDrafts();
  const { library, fetchLibrary, isLoadingLibrary, setIsLoadingLibrary } = useLibrary();

  const { navigateState, create } = useStateLoader();

  const [selectedSegment, setSelectedSegment] = useState<string>(ItemSegments.DRAFTS);

  const timeout = 100;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (window.scrollY > 400) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowToTop(true);
        }, timeout);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowToTop(false);
        }, timeout);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [animateHide, setAnimateHide] = useState(false);

  useEffect(() => {
    if (!showToTop) {
      setAnimateHide(true);
      setTimeout(() => {
        setAnimateHide(false);
      }, timeout);
    }
  }, [showToTop]);

  const scrollStep = -60;

  const scrollToTop = () => {
    const smoothScroll = () => {
      if (window.scrollY > 0) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(smoothScroll);
      }
    };

    requestAnimationFrame(smoothScroll);
    document.body.focus();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSegment === ItemSegments.DRAFTS) {
          await fetchDrafts(true);
        } else if (selectedSegment === ItemSegments.LIBRARY) {
          await fetchLibrary();
        }
      }
      catch(e) {
        setError(getErrorMessage(e));
      }
    };
    fetchData();
  }, [user, selectedSegment]);

  const createNew = () => {
    if(selectedSegment === ItemSegments.DRAFTS) {
      create(user);
    }
    else if(selectedSegment === ItemSegments.COLLECTIONS) {
      // createCollection();
    }
  };

  const alertRestorePurchases = () => {
    // TODO:
    // Show Confirmation Popup:
    //   On confirmed, call function below: onRestorePurchases();
    //   On Cancel, hide/remove popup
    setOpenModalRestoringPurchase(true);
  };

  const onRestorePurchases = async () => {
    setConfirmLoading(true);
    try {
      const restorePurchasesResponse = await restorePurchases();
      if (restorePurchasesResponse.data.success) {
        console.log('Purchases Resored Successfully!');
        // TODO:
        // Show Ok Popup.
      }
    } catch (e) {
      console.log(
        'Error attempting to restore purchases:' + (e as Error).message
      );
    }
    setConfirmLoading(false);
    setOpenModalRestoringPurchase(false);
  };

  const alertDeleteDraft = (draft: FTProduct) => async () => {
    setDeleteDraftModal(draft);
  };

  const onDeleteDraft = async (draft: FTProduct) => {
    setDeleteError(null);
    setDeletingDraft(draft);
    setConfirmLoading(true);
    try {
      const deleteDraftResponse = await deleteDraft(draft._id);
      if (deleteDraftResponse.data.success) {
        const updated_items = drafts.filter(p => {
          return p !== draft;
        });
        setDrafts(updated_items);
        updateMenuDrafts(updated_items);
        console.log('Draft Successfully deleted!');
      }
      else {
        setDeleteError(deleteDraftResponse.data.message);
      }
    } catch (e) {
      console.log('Error attempting to delete draft:' + (e as Error).message);
      setError(getErrorMessage(e));
    }
    setDeletingDraft(null);
    setDeleteDraftModal(null);
    setConfirmLoading(false);
  };

  const handleSegmentSelection = (selectedOption: string) => {
    if (selectedOption !== selectedSegment) {
      setSelectedSegment(selectedOption);
    }
  };

  const title = isDesigner ? "My Drafts" : "My wardrobe";
  const pageOptions = isDesigner ? [] : [ItemSegments.DRAFTS, ItemSegments.LIBRARY];

  return (
    <>
      <div className={s.myItemsHeader}>
        <div className="myWardrobeText">{ title }</div>
        <SegmentedControl
          options={pageOptions}
          onSelectionChange={handleSegmentSelection}
        />
        <div className={s.space}>
          {(selectedSegment === ItemSegments.DRAFTS || selectedSegment === ItemSegments.COLLECTIONS) && (
            <Button
              // onClick={() => create()}
              onClick={createNew}
              variant="function"
              // leftIcon={<IconAdd />}
              leftIcon={<UIIcon icon="IconAdd" />}
            >
              CREATE NEW
            </Button>
          )}
          {selectedSegment === ItemSegments.LIBRARY &&
            !isLoadingLibrary &&
            library?.length > 0 && (
              <Button variant="function" onClick={alertRestorePurchases}>
                RESTORE PURCHASES
              </Button>
            )}
        </div>
      </div>
      {/* <div className={s.catalogHeader}>Drafts</div> */}

      {isLoadingDrafts || isLoadingLibrary ? (
        <Loader centered />
      ) : selectedSegment === ItemSegments.DRAFTS ? (
        <div className={`${s.productsList} list`}>
          {drafts?.map(draft => {
            return (
              <UIDraftCard
                key={draft._id}
                price={`${DEFAULT_CURRENCY_TYPE}${draft.price.toString()}`}
                author={user?.first_name + ' ' + user?.last_name}
                lastUpdate={getProductDate(draft)}
                purchased={draft.purchased}
                title={draft.data?.title ? draft.data?.title : '(No title)'}
                onClick={() => navigateState(draft)}
                onDeleteClick={alertDeleteDraft(draft)}
                isDeleting={deletingDraft === draft}
                image={getProductImage(draft)}
              />
            );
          })}
        </div>
      ) : (
        <div className={`${s.productsList} list`}>
          {library?.map(draft => {
            return (
              <UIDraftCard
                key={draft._id}
                price={`${DEFAULT_CURRENCY_TYPE}${draft.price.toString()}`}
                author={user?.first_name + ' ' + user?.last_name}
                lastUpdate={getProductDate(draft)}
                purchased={draft.purchased}
                title={draft.data?.title ? draft.data?.title : '(No title)'}
                onClick={() => navigateState(draft)}
                image={getProductImage(draft)}
              />
            );
          })}
        </div>
      )}
        {isLoadingMore ? (
            <Loader centered size={LOADER_SIZE.SMALL} />
        )
        : 
        (hasMore &&
            <div className={s.load_more}>
                <Button
                onClick={loadMoreDrafts}
                variant="function"
                >
                LOAD MORE
                </Button>
            </div>
        )}
      {deleteDraftModal !== null && (
        <ModalConfirm
          title="Delete"
          description="Do you want to delete the draft?"
          opened
          confirmButtonText="Delete draft"
          onConfirm={() => onDeleteDraft(deleteDraftModal)}
          onClose={() => setDeleteDraftModal(null)}
          isLoading={confirmLoading}
        />
      )}
      {openModalRestoringPurchase && (
        <ModalConfirm
          title="Restore purchases"
          description="Do you want to restore purchases?"
          opened
          onConfirm={() => onRestorePurchases()}
          onClose={() => setOpenModalRestoringPurchase(false)}
          isLoading={confirmLoading}
        />
      )}
      {error.length > 0 && <div className={s.error}>{error}</div>}
      <Button
        variant="round"
        centreIcon={<IconTop />}
        onClick={scrollToTop}
        //TODO разобратся почему не работает через className
        style={{
          position: 'fixed',
          opacity: showToTop || animateHide ? 1 : 0,
          transform: showToTop ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: showToTop ? 'all' : 'none',
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        }}
      />
      { deleteError && 
      <ModalAlert
        opened
        title={'Error deleting product'}
        message={deleteError}
        onClose={() => setDeleteError(null)}
        isError={true}
      />
      }
    </>
  );
};
