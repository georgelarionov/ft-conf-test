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
import { useStateLoader } from '../../../utils/draftUtils';
import IconTop from '../../../public/images/ToTop.svg';
import css from '../Signup/signup.module.scss';
import { useRouter } from 'hooks/useRouter';
import ModalAlert from 'components/UI/ModalAlert';
import { IconContext } from 'components/UI/UIIcon/IconData';
import { useCollectionProducts } from 'hooks/useCollectionProducts';
import { getErrorMessage } from 'utils/common';

export const CollectionItemsList = () => {
    const router = useRouter();
    const collectionId = router.query.id as string;
    const { user, updateMenuDrafts } = useAuth();
    const isDesigner = (user instanceof Designer);
    const { 
        title,
        drafts, setDrafts, 
        isLoadingProducts, 
        fetchProducts, 
        hasMore, loadMoreProducts, isLoadingMore,
        deleteCollection
    } = useCollectionProducts();
    
    const { deleteDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
    const [deletingDraft, setDeletingDraft] = useState<FTProduct | null>(null);

    const [showToTop, setShowToTop] = useState(false);

    const [deleteDraftModal, setDeleteDraftModal] = useState<any>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState<any>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { navigateState } = useStateLoader();

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
                await fetchProducts(collectionId);
            }
            catch(err) {
                setError(getErrorMessage(err));
            }
        }
        fetchData();
    }, [collectionId]);

    const loadMore = () => {
        loadMoreProducts(collectionId);
    };

    const alertDeleteDraft = (draft: FTProduct) => async () => {
        setDeleteDraftModal(draft);
    };

    const onDeleteDraft = async (draft: FTProduct) => {
        setError('');
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

    const handleEditCollection = () => {
        router.push({
        pathname: '/create-collection',
        query: { id: collectionId },
        });
    };

    const handleDeleteCollection = (e) => {
        e.preventDefault();
        setIsDeleting(false)
        setDeleteError(null);
        setDeleteConfirmModal(true);
    };

    const onConfirmDeleteCollection = async (e) => {
        setIsDeleting(true)
        try {
            const response = await deleteCollection(collectionId);
            console.log("Delete Coll Response:"+JSON.stringify(response));
            if(response.data.success) {
                router.push('/create-collection');
            }
            else {
                setDeleteError(response.data.message);
            }
        }
        catch(e) {
            const err = e as Error;
            setDeleteError(err.message);
        }
        setDeleteConfirmModal(false);
    };
  
    return (
        <>
        <div className={s.myItemsHeader}>
            <div className="myWardrobeText">{ title }</div>
            { isDesigner && (
            <div className={s.space}>
                <Button
                    onClick={handleEditCollection}
                    variant="function"
                    leftIcon={<IconContext />}
                >
                    EDIT
                </Button>
                <Button
                    onClick={handleDeleteCollection}
                    variant="function"
                    className={s.deleteButton}
                >
                    DELETE
                </Button>
            </div>
            )}
        </div>
        {isLoadingProducts ? (
            <Loader centered />
        ) : (
            <div className={`${s.productsList} list`}>
            {drafts?.map(draft => {
                return (
                <UIDraftCard
                    key={draft._id}
                    price={`${DEFAULT_CURRENCY_TYPE}${draft.price.toString()}`}
                    author={user?.first_name + ' ' + user?.last_name}
                    lastUpdate={getProductDate(draft)}
                    title={draft.data?.title ? draft.data?.title : '(No title)'}
                    onClick={() => navigateState(draft)}
                    canDelete={user?._id === draft.original_owner}
                    onDeleteClick={alertDeleteDraft(draft)}
                    isDeleting={deletingDraft === draft}
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
            description="Do you want to delete the product?"
            opened
            confirmButtonText="Delete product"
            onConfirm={() => onDeleteDraft(deleteDraftModal)}
            onClose={() => setDeleteDraftModal(null)}
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
        {deleteConfirmModal && (
            <ModalConfirm
                title="Delete Collection"
                description={`Do you want to delete the colection?\nThis will not delete the products, only the collection they appear in.`}
                opened
                confirmButtonText="Delete collection"
                onConfirm={onConfirmDeleteCollection}
                onClose={() => setDeleteConfirmModal(false)}
                isLoading={isDeleting}
            />
        )}
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
