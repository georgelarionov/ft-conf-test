import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import ModalConfirm from '../ModalConfirm';

import css from './styles.module.scss';

const ConfirmButton = ({
  children,
  text,
  description,
  className,
  onConfirm,
  onCancel,
  onClick,
  disabled,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: any) => {
    if (onClick) {
      onClick();
    }
    setIsOpen(true);
    e.preventDefault();
  };

  const handleClose = useCallback(
    (e: any) => {
      e.preventDefault();
      setIsOpen(false);
      if (onCancel) {
        onCancel(e);
      }
    },
    [onCancel]
  );

  const handleConfirm = useCallback(
    (e: any) => {
      e.preventDefault();
      setIsOpen(false);
      setTimeout(() => {
        onConfirm(e);
      });
    },
    [onConfirm]
  );

  return (
    <>
      <button
        className={clsx(
          className ? className : css.button,
          disabled && css.disabled
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </button>
      <ModalConfirm
        opened={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={text}
        description={description}
      />
    </>
  );
};

export default ConfirmButton;
