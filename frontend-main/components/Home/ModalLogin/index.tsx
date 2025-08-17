import { ReactNode } from 'react';

import Modal from 'components/UI/Modal';

import css from './styles.module.scss';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';

type TModalConfirm = {
  opened: boolean;
  onClose: (e: any) => void;
  onLoginCustomer: (e: any) => void;
  onLoginDesigner: (e: any) => void;
  title: string | ReactNode;
  description?: string | ReactNode;
  customerLoginButtonText?: string;
  designerLoginButtonText?: string;
};

const ModalLogin = ({
  opened,
  onClose,
  onLoginCustomer,
  onLoginDesigner,
  title,
  description,
  customerLoginButtonText,
  designerLoginButtonText
}: TModalConfirm) => {
  return (
    <Modal opened={opened} onClose={onClose} closeButtonShow={false}>
      <Modal.Title centered>{title}</Modal.Title>
      {description && <div className={css.description}>{description}</div>}
      <div className={css.actions}>
        <Button variant="function" onClick={onLoginCustomer}>
          {customerLoginButtonText}
        </Button>
        <Button
          variant="function" onClick={onLoginDesigner}>
          {designerLoginButtonText}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalLogin;
