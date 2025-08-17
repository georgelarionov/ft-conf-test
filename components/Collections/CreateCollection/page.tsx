import css from './page.module.scss';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'hooks/useRouter';
import { Layout, LayoutContent, LayoutSidebar } from '../../layouts/Layout';
import MainHeader from '../../MainHeader/MainHeader';
// import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import * as endpoints from '../../../utils/endpoints/endpoints';
// import { useDrafts } from 'hooks/useDrafts';
import { getProductImage } from 'utils/productUtils';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { FTProduct, ICollection } from 'utils/dbModels';
import { useIsMobile } from 'hooks/mobileResolutionDetect';
import { deleteCollection } from 'utils/endpoints/endpoints-debug-designer';
import ModalConfirm from 'components/UI/ModalConfirm';
import ModalAlert from 'components/UI/ModalAlert';
import { getErrorMessage } from 'utils/common';

const MIN_PRODUCTS = 3;
const MAX_PRODUCTS = 20;

export default function CreateCollectionPage() {
    const isMobileSize = useIsMobile();
    const router = useRouter();
    let collectionId = router.query.id as string;
    // console.log('CollectionId:'+collectionId);
    // const { drafts, isLoadingDrafts, fetchDrafts } = useDrafts();
    // const { user, isAuthorized } = useAuth();
    const { loadDrafts, addCollection, loadCollection, updateCollection } = endpoints.Designers;
    const [drafts, setDrafts] = useState<FTProduct[]>([]);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
    const [name, setName] = useState("");
    // const [loadedName, setLoadedName] = useState("");
    const [description, setDescription] = useState("");
    // const [loadedDescription, setLoadedDescription] = useState("");
    const [selectedCards, setSelectedCards] = useState<Array<string>>([]);
    const [loadedSelectedCards, setLoadedSelectedCards] = useState<Array<string>>([]);
    const [loadedCollection, setLoadedCollection] = useState<ICollection | null>(null);
    const [submitActionDisabled, setSubmitActionDisabled] = useState(true);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState('');
    // const [isPublishing, setIsPublishing] = useState(false);
    // const [publishedTitle, setPublishedTitle] = useState("");
    // const [publishActionTitle, setPublishActionTitle] = useState("");
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleted, setIsDeleted] = useState<any>(null);
    const [deleteError, setDeleteError] = useState<any>(null);

    const collectionNameTitle = collectionId ? 'Edit Collection' : 'New Collection';
    const submitActionTitle = collectionId ? 'Update Collection' : 'Create Collection';
    
    const clear = () => {
        setError('');
        setDrafts([]);
        setName("");
        // setLoadedName("");
        setDescription("");
        // setLoadedDescription("");
        setSelectedCards([]);
        // setLoadedSelectedCards([]);
        setLoadedCollection(null);
        setSuccessMessage("");
    };

    useEffect(() => {
        clear();

        const fetchData = async () => {
            setIsLoadingDrafts(true);
            try {
                const response = await loadDrafts({ populate: true, full: true, new_coll: true });
                const drafts = response.data.drafts as FTProduct[];
                setDrafts(drafts);
            } catch (err) {
                console.error("Failed to load drafts:", error);
                setError(getErrorMessage(err));
            }
            setIsLoadingDrafts(false);
        }
        
        const fetchCollection = async () => {
            try {
                const response = await loadCollection({ coll_id: collectionId, populate: true, full: true, other_prods: true });
                // console.log("Collection response.data:"+JSON.stringify(response.data));
                const collection = response.data.collection as ICollection;
                setLoadedCollection(collection);
                setName(collection.name);
                // setLoadedName(collection.name);
                setDescription(collection.description);
                // setLoadedDescription(collection.description);
                const coll_products = response.data.collection_products as FTProduct [];
                const other_products = response.data.other_products as FTProduct [];
                const all_products = coll_products.concat(other_products);
                setDrafts(all_products);
                const coll_products_ids = coll_products.map(p => p._id);
                setSelectedCards(coll_products_ids);
                setLoadedSelectedCards(coll_products_ids);
            }
            catch(err) {
                setError(getErrorMessage(err));
            }
        }
        if(collectionId) {
            fetchCollection();
        }
        else {
            fetchData();
        }
    }, [collectionId]);

    
    // useEffect(() => {
    //     const updatePublishedStatuses = async () => {
    //         const published_title = loadedCollection?.published ? 'Published' : 'Not Published';
    //         setPublishedTitle(published_title);
    //         const publish_action_title = loadedCollection?.published ? 'Un-publish Collection' : 'Publish Collection';
    //         setPublishActionTitle(publish_action_title);
    //     }
    //     updatePublishedStatuses();
        
    // }, [loadedCollection?.published]);

    const updateSubmitActionStatus = (params: { newName?: string, newDescription?: string, newCardSelections?: Array<string> }) => {
        let disabled = false;
        if(params.newName) {
            disabled = params.newName === loadedCollection?.name;
        }
        if(params.newDescription) {
            disabled = params.newDescription === loadedCollection?.description;
        }
        if(params.newCardSelections) {
            const sameCards = JSON.stringify(loadedSelectedCards) === JSON.stringify(params.newCardSelections);
            disabled = params.newCardSelections.length < MIN_PRODUCTS || sameCards;
        }
        setSubmitActionDisabled(disabled);
    };

    const handleChangeName = (e) => {
        const newName = e.target.value;
        setName(newName);
        // if (collectionId) {
            // const disabled = submitActionDisabled && newName === loadedCollection?.name;
            // setSubmitActionDisabled(disabled);
        // }
        updateSubmitActionStatus({ newName: newName });
    };

    const handleChangeDescription = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        // if (collectionId) {
        //     const disabled = submitActionDisabled && newDescription === loadedCollection?.description;
        //     setSubmitActionDisabled(disabled);
        // }
        updateSubmitActionStatus({ newDescription: newDescription });
    };

    const handleSelectCard = (id) => {
        setSelectedCards((prev) => {
            if (prev.includes(id)) {
                return prev.filter((cardId) => cardId !== id);
            } 
            else if (prev.length < MAX_PRODUCTS) {
                return [...prev, id];
            }
            return prev;
        });
        // const sameCards = JSON.stringify(loadedSelectedCards) === JSON.stringify(selectedCards);
        // const disabled = submitActionDisabled && (selectedCards.length < MIN_PRODUCTS || !sameCards);
        // setSubmitActionDisabled(disabled);
        // updateSubmitActionStatus({ newCardSelections: selectedCards });
        updateSubmitActionStatus({ newCardSelections: [...selectedCards, id] });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        if (selectedCards.length < MIN_PRODUCTS) {
            alert(`Please select at least ${MIN_PRODUCTS} cards.`);
            return;
        }

        setIsCreatingCollection(true);
        
        try {
            let response;
            let didCreate = false;

            if(loadedCollection) {
                response = await updateCollection({ coll_id: collectionId, name: name, description: description, productIds: selectedCards });
            }
            else {
                response = await addCollection({ name: name, description: description, productIds: selectedCards });
                didCreate = true;
            }
            if (response.data.success) {
                if(didCreate) {
                    router.push({
                        pathname: '/collections',
                        query: { segment: 'pending' }
                    });
                    return;
                }
                const responseCollection = response.data.collection as ICollection;
                const success_message = responseCollection ? 'Collection Successfully created!' : 'Collection updated!';
                if (responseCollection) {
                    setName('');
                    setDescription('');
                    setSelectedCards([]);
                    collectionId = responseCollection._id;
                    setLoadedCollection(responseCollection);
                }
                setSuccessMessage(success_message);
            } 
            else {
                setError('Error trying to add the collection!');
            }
        }
        catch(err) {
            setError(getErrorMessage(err));
        }

        setIsCreatingCollection(false);
    };

    // const handlePublishCollection = async (e) => {
    //     e.preventDefault();
    //     setIsPublishing(true);
    //     setError('');

    //     try {
    //         const response = await updateCollection({ coll_id: collectionId, published: !loadedCollection?.published });
    //         if (response.data.success) {
    //             setLoadedCollection(prev => prev ? { ...prev, published: !loadedCollection?.published } : null);
    //             const message = loadedCollection?.published ? 'Collection Successfully un-published!' : 'Collection Successfully published!';
    //             setSuccessMessage(message);
    //         } 
    //         else {
    //             setError('Error trying to publish the collection!');
    //         }
    //     }
    //     catch(err) {
    //         console.log(err);
    //         const e = err as Error;
    //         setError(e.message);
    //     }

    //     setIsPublishing(false);
    // };

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
            // console.log("Delete Coll Response:"+JSON.stringify(response));
            if(response.data.success) {
                setIsDeleted(response.data.message);
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

    const onHandleAfterDelete = async () => {
        router.push('/collections');
    };
    
    return (
        <>
            <Layout>
                <LayoutSidebar />
                <LayoutContent>
                    <MainHeader withLogo={false} />
                    <div className={css.content}>
                        <div style={{ width: '100%', margin: "auto", padding: 20 }}>
                            <h2>{collectionNameTitle}</h2>
                            <div><br/></div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Collection Name"
                                    value={name}
                                    onChange={handleChangeName}
                                    required
                                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={handleChangeDescription}
                                    rows={3}
                                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                                />
                                <div
                                    style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                                    gap: 10,
                                    maxHeight: '320px',
                                    overflowY: "auto",
                                    border: "1px solid #ccc",
                                    padding: 10
                                }}
                                className={css.list}
                                >
                                {isLoadingDrafts ? (
                                    <Loader centered size={LOADER_SIZE.NORMAL} />
                                ) : drafts.length == 0 ? (
                                    'No drafts'
                                ) : (drafts.map((draft) => {
                                    const image = getProductImage(draft);
                                    return (
                                        <div
                                            key={draft._id}
                                            onClick={() => handleSelectCard(draft._id)}
                                            className={classNames({
                                                [css.item]: true,
                                                [css.item_selected]: selectedCards.includes(draft._id)
                                              })}
                                        >
                                            {/* {draft.title} */}
                                            <div>{!!image && <img src={image} alt="" />}</div>
                                        </div>
                                    )}
                                ))}
                                </div>
                                <p>{selectedCards.length} selected (Min: {MIN_PRODUCTS}, Max: {MAX_PRODUCTS})</p>
                                {isCreatingCollection ? (
                                    <Loader size={LOADER_SIZE.NORMAL} />
                                ) : (
                                    <div style={{ display: 'flex' }}>
                                        <Button 
                                            type='submit'
                                            disabled={submitActionDisabled}
                                            className={css.createButton}>
                                            {submitActionTitle}
                                        </Button>
                                        <div style={{ width: '100%' }}></div>
                                        { collectionId && 
                                        <Button 
                                            className={css.deleteButton}
                                            onClick={handleDeleteCollection}>
                                            Delete Collection
                                        </Button>
                                        }
                                    </div>
                                )}
                                <br/>
                                {successMessage.length > 0 && <div>{successMessage}</div>}
                                {error.length > 0 && <div className={css.error}>{error}</div>}
                            </form>
                        </div>
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
                            title={'Error Deleting Collection'}
                            message={deleteError}
                            onClose={() => setDeleteError(null)}
                            isError={true}
                        />
                        }
                        { deleted && 
                        <ModalAlert
                            opened
                            title={'Collection Deleted'}
                            message={deleted}
                            onClose={onHandleAfterDelete}
                            isError={true}
                        />
                        }
                    </div>
                </LayoutContent>
            </Layout>
        </>
    );
}
