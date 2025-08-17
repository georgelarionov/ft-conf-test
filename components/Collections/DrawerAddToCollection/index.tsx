
import s from './styles.module.scss';
import p from '../../VideoCreate/DownloadPopup/ProcessingPopup/styles.module.css';
import { UIIcon } from '../../UI/UIIcon/UIIcon';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { IconClose } from '../../UI/UIIcon/IconData';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import * as endpoints from '../../../utils/endpoints/endpoints';
import { useCollections } from 'hooks/useCollections';

export const DrawerAddToCollection = ({
    product_id,
    visible = false,
    setVisible = (v) => {},
    setResponseMessage = (v) => {},
    setErrorResponse = (v) => {}
}) => {
    const { addProductToCollections } = endpoints.Designers;
    const { collections, fetchCollections } = useCollections();
    const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
    const [isAddingToCollections, setIsAddingToCollections] = useState(false);
    const [collection_action_label, setcollection_action_label] = useState('Collection');
    const [error, setError] = useState<string|undefined>(undefined);
    const isMobileSize = useIsMobile();

    useEffect(() => {
        setSelectedCollections(new Set());
        const fetchData = async () => {
            await fetchCollections({ published: false, all: true });
        };
        if (visible) {
            fetchData();
        }
    }, [visible]);

    const toggleSelection = (collId: string) => {
        setSelectedCollections((prev) => {
            const newSet = new Set(prev);
            newSet.has(collId) ? newSet.delete(collId) : newSet.add(collId);
            const coll_action_label = newSet.size > 1 ? 'Collections' : 'Collection';
            setcollection_action_label(coll_action_label);
            
            return newSet;
        });
    };

    const handleAddToCollections = async () => {
        setErrorResponse(false);
        setResponseMessage(null);
        setIsAddingToCollections(true);
        
        try {
          const response = await addProductToCollections(Array.from(selectedCollections), product_id);
          if(response.data.success) {
            setResponseMessage(response.data.message);
          }
          else {
            setErrorResponse(true);
            setResponseMessage(response.data.message);
          }
        }
        catch(err) {
          const e = err as Error;
          setErrorResponse(true);
          setResponseMessage(e.message);
        }
        setVisible(false);
        setIsAddingToCollections(false);
    };
    
    return (
        <div
        className={classNames({
            [s.base]: true,
            [s.showed]: visible,
        })}
        >
        <div
            className={s.background}
            onClick={() => setVisible(false)}
        ></div>

        <div className={s.cart}>
            <div className={s.header}>
                {isMobileSize ? (
                    <button
                    className={s.closeCart}
                    onClick={() => setVisible(false)}
                    aria-label="Close sidebar"
                    >
                    <IconClose />
                    </button>
                ) : (
                    <UIIcon
                    icon="close"
                    className={p.close}
                    onClick={() => setVisible(false)}
                    />
                )}
            </div>
            <>
                <div className={s.content}>
                    <div className={s.title}>Add Product To Collection(s)</div>
                    <div>Unpublished Collections</div>
                    <ul className={s.collection_list}>
                    {collections.map((collection) => (
                        <li
                            key={collection._id}
                            className={`${selectedCollections.has(collection._id) ? "selected" : ""}`}
                            onClick={() => toggleSelection(collection._id)}>
                                <span className={s.collection_name}>{collection.name}</span>
                                {selectedCollections.has(collection._id) && 
                                <span className={s.checkmark}> ✓</span>
                                }
                        </li>
                    ))}
                    </ul>
                </div>
                {error && error.length > 0 && <div className={s.error}>{error}</div>}
                {!isAddingToCollections && (
                <div className={s.buttonSubmit}>
                    <Button 
                        disabled={selectedCollections.size === 0}
                        onClick={handleAddToCollections} 
                        variant="function">
                    Assign To {collection_action_label}
                    </Button>
                </div>
                )}
                {isAddingToCollections && (
                <div className={s.checkingOut}>
                    <span>Assigning to {collection_action_label.toLowerCase()}...</span>
                    <Loader centered size={ LOADER_SIZE.NORMAL } />
                </div>
                )}
            </>
        </div>
    </div>
  );
};
