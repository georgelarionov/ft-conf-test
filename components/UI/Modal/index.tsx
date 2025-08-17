/* eslint-disable react/display-name */
import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import css from './styles.module.scss';

export type TModalProps = {
  opened?: boolean;
  onClose?: (e: any) => void;
  closeButtonShow?: boolean;
  isCustomContent?: boolean;
  children: ReactNode;
  zIndex?: number;
  className?: string;
};

export const beforeCloses = (top: number) => {
  document.body.style.position = '';
  document.body.style.overflow = '';
  document.body.style.top = '';
  window.scrollTo({ top: Math.abs(top) });
};

export const beforeOpened = () => {
  const top = document?.body?.getBoundingClientRect().top || 0;
  document.body.style.position = '';
  document.body.style.overflow = 'hidden';
  document.body.style.top = `${top}px`;
  return top;
};

const Modal = ({
  opened,
  onClose,
  closeButtonShow,
  isCustomContent,
  children,
  zIndex,
  className,
}: TModalProps) => {
  const topRef = useRef<number>(0);

  const shouldShowCloseButton = closeButtonShow ?? !!onClose;

  useEffect(() => {
    if (opened) {
      topRef.current = beforeOpened();
    } else if (topRef.current != null) {
      beforeCloses(topRef.current);
    }
  }, [opened]);

  const unmount = useCallback(() => {
    if (opened && topRef.current != null) {
      beforeCloses(topRef.current);
    }
  }, []);

  useEffect(() => unmount, []);

  if (!opened) {
    return null;
  }

  return createPortal(
    <div className={css.modal} style={zIndex ? { zIndex } : {}}>
      <div className={css.background} onClick={onClose} />
      {isCustomContent ? (
        children
      ) : (
        <div className={clsx(css.content, className && className)}>
          {shouldShowCloseButton && (
            <div className={css.closeButton} onClick={onClose}>
              <img
                src="/images/closeIco.svg"
                width="20"
                height="20"
                alt=""
              />
            </div>
          )}
          {children}
        </div>
      )}
    </div>,
    document.body
  );
};

Modal.Title = ({ centered, children, className }: any) => {
  return (
    <h3
      className={clsx(
        css.title,
        centered && css.centered,
        className && className
      )}
    >
      {children}
    </h3>
  );
};

Modal.Buttons = ({ children }: any) => {
  return <div className={css.buttons}>{children}</div>;
};

export default Modal;
