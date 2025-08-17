import React, { useEffect, useState } from 'react';

import s from './styles.module.scss';
import { DEFAULT_CURRENCY_TYPE } from '../../../utils/consts';
import { useAuth } from '../../../hooks/providers/AuthProvider/AuthProvider';
import { Designer, FTProduct, ICollection } from '../../../utils/dbModels';
import * as endpoints from '../../../utils/endpoints/endpoints';
import { UIDraftCard } from '../../UI/UIDraftCard/UIDraftCard';
// import Link from 'next/link';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { getProductDate, getProductImage } from '../../../utils/productUtils';
import IconAdd from '../../../public/images/Union.svg';
import ModalConfirm from 'components/UI/ModalConfirm';
import { useDrafts } from '../../../hooks/useDrafts';
import { useLibrary } from '../../../hooks/useLibrary';
import { useCollections } from 'hooks/useCollections';
import { useStateLoader } from '../../../utils/draftUtils';
import { useRouter } from 'hooks/useRouter';
// import { PRODUCT_PRICE } from 'utils/common';
import SegmentedControl from 'components/UI/SegmentedControl/SegmentedControl';
// import { loadDrafts } from 'utils/endpoints/endpoints-debug-customer';
import IconTop from '../../../public/images/ToTop.svg';
import CollectionProductsRow from 'components/sections/CollectionProductsRow';

// const ItemSegments = {
//   PUBLISHED: 'published',
//   DRAFTS: 'drafts'
// }

export const PublishedCollections = () => {
  const router = useRouter();
  const { user, updateMenuDrafts } = useAuth();
  // const { deleteDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
  const { restorePurchases } = endpoints.Customers;
  const [deletingDraft, setDeletingDraft] = useState<FTProduct | null>(null);

  const [showToTop, setShowToTop] = useState(false);

  const [deleteDraftModal, setDeleteDraftModal] = useState<any>(null);
  const [openModalRestoringPurchase, setOpenModalRestoringPurchase] =
    useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const { collections } = useAuth();

  // const isDesigner = (user instanceof Designer);

  // const { drafts, setDrafts, fetchDrafts, isLoadingDrafts, setIsLoadingDrafts } = useDrafts();

  // const { library, fetchLibrary, isLoadingLibrary, setIsLoadingLibrary } = useLibrary();

  const { collections, isLoadingCollections, fetchCollections, hasMore, loadMoreCollections, isLoadingMore } = useCollections();

  const { navigateState } = useStateLoader();

  // const [selectedSegment, setSelectedSegment] = useState<String>(ItemSegments.PUBLISHED);

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
      await fetchCollections({ published: true, all: true });
    };
    fetchData();
  }, [user]);

  const loadMore = () => {
    loadMoreCollections({ published: true, all: true });
  };

  // const handleSegmentSelection = (selectedOption: String) => {
  //   if (selectedOption !== selectedSegment) {
  //     setSelectedSegment(selectedOption);
  //   }
  // };

  const handleViewCollection = (collection: ICollection) => {
    router.push({
      pathname: '/collection',
      query: { id: collection._id }
    });
  };

  const title = "Designer Collections";
  // const pageOptions = [ItemSegments.PUBLISHED, ItemSegments.DRAFTS];

  return (
    <>
      <div className={s.myItemsHeader}>
        <div className="myWardrobeText">{ title }</div>
        {/* <SegmentedControl
          options={pageOptions}
          onSelectionChange={handleSegmentSelection}
        /> */}
        <div className={s.space}>
        </div>
      </div>
      {/* <div className={s.catalogHeader}>Drafts</div> */}

      {isLoadingCollections ? (
        <Loader centered />
      ) : (
        <div className={`${s.collectionsList} list`}>
          {collections?.map(collection => {
            const collectionTitle = `${collection.name} by ${collection.vendor}`;
            return (
              <CollectionProductsRow 
                key={collection._id}
                title={collectionTitle}
                items={collection.products}
                isLoading={isLoadingCollections}
                onItemClick={(item) => navigateState(item)}
                onViewAllClick={() => handleViewCollection(collection)}
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
                onClick={loadMore}
                variant="function"
                >
                LOAD MORE
                </Button>
            </div>
        )}
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
    </>
  );
};
