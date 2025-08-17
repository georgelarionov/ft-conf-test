import { ReactNode } from 'react';

import Modal from '../Modal';

import css from './styles.module.scss';
import Button from '../Button';
import Loader, { LOADER_SIZE } from '../Loader';

type TModalConfirm = {
  opened: boolean;
  onClose: (e: any) => void;
  onConfirm: (e: any) => void;
  title: string | ReactNode;
  description?: string | ReactNode;
  confirmButtonText?: string;
  confirmButtonClassName?: string;
  closeButtonText?: string;
  isLoading?: boolean;
};

const ModalConfirm = ({
  opened,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  confirmButtonClassName = '',
  closeButtonText,
  isLoading,
}: TModalConfirm) => {
  return (
    <Modal opened={opened} onClose={onClose} closeButtonShow={false}>
      <Modal.Title centered>{title}</Modal.Title>
      {description && <div className={css.description}>{description}</div>}
      <div className={css.actions}>
        <Button variant="function" onClick={onClose} disabled={isLoading}>
          {closeButtonText || 'Cancel'}
        </Button>
        <Button
          variant="function"
          onClick={onConfirm}
          className={confirmButtonClassName}
          disabled={isLoading}
        >
          {isLoading ? <Loader size={LOADER_SIZE.SMALL} /> : confirmButtonText || 'Yes'}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
