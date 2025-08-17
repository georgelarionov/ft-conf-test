import { ReactNode, useEffect, useState } from 'react';

import Modal from 'components/UI/Modal';

import css from './styles.module.scss';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { useCollections } from 'hooks/useCollections';

type TModalAddToCollection = {
  opened: boolean;
  onClose: (e: any) => void;
  onConfirm: (selectedItems: any[]) => void;
  title: string | ReactNode;
  description?: string | ReactNode;
  confirmButtonText?: string;
  confirmButtonClassName?: string;
  closeButtonText?: string;
  isLoading?: boolean;
};

const ModalAddToCollection = ({
  opened,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  confirmButtonClassName = '',
  closeButtonText,
  isLoading,
}: TModalAddToCollection) => {
  const { collections, fetchCollections } = useCollections();
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      await fetchCollections({ published: false, all: true });
    };
    if (opened)
      fetchData();
  }, [opened]);

  const toggleSelection = (collId: string) => {
    setSelectedCollections((prev) => {
      const newSet = new Set(prev);
      newSet.has(collId) ? newSet.delete(collId) : newSet.add(collId);
      return newSet;
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} closeButtonShow={false}>
      <Modal.Title centered>{title}</Modal.Title>
      <div className={css.content}>
        <div><u>Unpublished Collections</u></div>
        <ul className={css.collection_list}>
          {collections.map((collection) => (
            <li
              key={collection._id}
              className={`${selectedCollections.has(collection._id) ? "selected" : ""}`}
              onClick={() => toggleSelection(collection._id)}
            >
              <span className={css.collection_name}>{collection.name}</span>
              {selectedCollections.has(collection._id) && 
              <span className={css.checkmark}> ✓</span>
              }
            </li>
          ))}
        </ul>
      </div>
      <div className={css.actions}>
        <Button variant="function" onClick={onClose} disabled={isLoading}>
          {closeButtonText || 'Cancel'}
        </Button>
        <Button
          variant="function"
          onClick={() => onConfirm(Array.from(selectedCollections))}
          className={confirmButtonClassName}
          disabled={isLoading}
        >
          {isLoading ? <Loader size={LOADER_SIZE.SMALL} /> : confirmButtonText || 'Yes'}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalAddToCollection;
