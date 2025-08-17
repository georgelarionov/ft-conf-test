import { ReactNode } from 'react';

import Modal from '../Modal';

import css from './styles.module.scss';
import Button from '../Button';
import classNames from 'classnames';

type TModalAlert = {
  opened: boolean;
  onClose: (e: any) => void;
  title: string | ReactNode;
  message?: string | ReactNode;
  confirmButtonText?: string;
  isError?: boolean;
};

const ModalAlert = ({
  opened,
  onClose,
  title,
  message,
  confirmButtonText,
  isError,
}: TModalAlert) => {
  return (
    <Modal opened={opened} onClose={onClose} closeButtonShow={false}>
      <Modal.Title centered>{title}</Modal.Title>
      {message && 
      <div className={classNames({
        [css.message]: true,
        [css.error]: isError
      })}>
        {message}
      </div>}
      <div className={css.actions}>
        <Button variant="function" onClick={onClose}>
          {confirmButtonText || 'Ok'}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalAlert;
