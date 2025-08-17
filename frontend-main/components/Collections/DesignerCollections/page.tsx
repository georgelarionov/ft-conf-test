import React, { useEffect, useState, useRef } from 'react';

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
import ModalAlert from 'components/UI/ModalAlert';
import { getErrorMessage } from 'utils/common';

const ItemSegments = {
  PUBLISHED: 'published',
  DRAFTS: 'pending'
}

export const DesignerCollections = () => {
  const router = useRouter();
  const segment = router.query.segment as string;
  const { user, updateMenuDrafts } = useAuth();
  // const { deleteDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
  const { restorePurchases } = endpoints.Customers;
  const [deletingDraft, setDeletingDraft] = useState<FTProduct | null>(null);

  const [showToTop, setShowToTop] = useState(false);

  const [deleteDraftModal, setDeleteDraftModal] = useState<any>(null);
  const [openModalRestoringPurchase, setOpenModalRestoringPurchase] =
    useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [collectionToUpdate, setCollectionToUpdate] = useState<ICollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  
  const { collections, isLoadingCollections, fetchCollections, hasMore, loadMoreCollections, isLoadingMore } = useCollections();
  const { updateCollection } = endpoints.Designers;

  const { navigateState } = useStateLoader();

  const [selectedSegment, setSelectedSegment] = useState<string>(segment === 'pending' ? ItemSegments.DRAFTS : ItemSegments.PUBLISHED);

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
      if (selectedSegment === ItemSegments.PUBLISHED) {
        await fetchCollections({ user_id: user?._id, published: true, all: true });
      }
      else if (selectedSegment === ItemSegments.DRAFTS) {
        await fetchCollections({ user_id: user?._id, published: false, all: true });
      }
    };
    fetchData();
  }, [user, selectedSegment, collectionToUpdate?.published]);

  const loadMore = () => {
    const published = selectedSegment === ItemSegments.PUBLISHED;
    loadMoreCollections({ user_id: user?._id, published: published });
  };

  const createNew = () => {
    router.push({ pathname: '/create-collection' });
  };

  const alertDeleteDraft = (draft: FTProduct) => async () => {
    setDeleteDraftModal(draft);
  };

  const onDeleteDraft = async (draft: FTProduct) => {
    setDeletingDraft(draft);
    setConfirmLoading(true);
    try {
      // const deleteDraftResponse = await deleteDraft(draft._id);
      // if (deleteDraftResponse.data.success) {
      //   const updated_items = drafts.filter(p => {
      //     return p !== draft;
      //   });
      //   setDrafts(updated_items);
      //   updateMenuDrafts(updated_items);
      //   console.log('Draft Successfully deleted!');
      // }
    } catch (e) {
      console.log('Error attempting to delete draft:' + (e as Error).message);
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

  const handleViewCollection = (collection: ICollection) => {
    router.push({
      pathname: '/collection',
      query: { id: collection._id }
    });
  };

  const handleEditCollection = (collection: ICollection) => {
    router.push({
      pathname: '/create-collection',
      query: { id: collection._id }
    });
  };

  const handlePublishCollection = async (e, collection) => {
    e.preventDefault();
    setCollectionToUpdate(collection);
  };

  const onConfirmPublishCollection = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setError('');

    try {
      const collectionId = collectionToUpdate?._id;
      const isPublished = collectionToUpdate?.published;
      
      if (collectionId) {
        const response = await updateCollection({ coll_id: collectionId, published: !isPublished });
        if (response.data.success) {
            const message = isPublished ? 'Collection Successfully un-published!' : 'Collection Successfully published!';
            setResponseMessage(message);
        } 
        else {
            setError('Error trying to publish the collection!');
        }
      }
      else {
        setError('Error trying to publish the collection, No Id found!');
      }
    }
    catch(err) {
        console.log(err);
        setError(getErrorMessage(err));
    }

    setCollectionToUpdate(null);
    setIsPublishing(false);
  };

  const title = "Collections";
  const pageOptions = [ItemSegments.PUBLISHED, ItemSegments.DRAFTS];

  return (
    <>
      <div className={s.myItemsHeader}>
        <div className="myWardrobeText">{ title }</div>
        <SegmentedControl
          initialSelection={selectedSegment}
          options={pageOptions}
          onSelectionChange={handleSegmentSelection}
        />
        <div className={s.space}>
            <Button
              // onClick={() => create()}
              onClick={createNew}
              variant="function"
              leftIcon={<IconAdd />}
            >
              CREATE NEW
            </Button>
        </div>
      </div>
      {/* <div className={s.catalogHeader}>Drafts</div> */}

      {isLoadingCollections ? (
        <Loader centered />
      ) : (
        <div className={`${s.collectionsList} list`}>
          {collections?.map((collection, index: number) => {
            return (
              <CollectionProductsRow 
                  key={collection._id}
                  canEdit={true}
                  collection={collection}
                  items={collection.products}
                  isLoading={isLoadingCollections}
                  onItemClick={(item) => navigateState(item)}
                  onViewAllClick={() => handleViewCollection(collection)}
                  onEditClick={() => handleEditCollection(collection)}
                  onPublishClick={(e) => handlePublishCollection(e, collection)}
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
      { collectionToUpdate && (() => {
        const action = collectionToUpdate.published ? "Un-publish" : "Publish"
        const title = `${action} Collection`;
        const description = `Do you want to ${action} the collection?`;
        return (
          <ModalConfirm
            title={title}
            description={description}
            opened
            confirmButtonText={action}
            onConfirm={onConfirmPublishCollection}
            onClose={() => setCollectionToUpdate(null)}
            isLoading={isPublishing}
          />
        );
      })()}
      { responseMessage && 
        <ModalAlert
            opened
            title={""}
            message={responseMessage}
            onClose={() => setResponseMessage(null)}
        />
      }
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
