import { UIButton } from '../UI/UIButton/UIButton';
import classNames from 'classnames';
import s from './styles.module.scss';
import React from 'react';
import {
  useProducts,
  useSession,
  useUser,
  useMeta,
} from '../../hooks/providers';
import { calculateRouting } from '../MainActions/ActonsArrows/calculateRouting';
import { STEPS } from '../../type';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconArrowCollapse, IconLogo } from '../UI/UIIcon/IconData';
// import { canGoHomeWithoutSaving } from 'utils/common';
import { useSidebar } from '../../hooks/providers/SidebarProvider/SidebarProvider';
import { ModelView } from 'components/ModelView/ModelView';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';

export function MainHeaderLogo({
  onNoSavePopup,
}: {
  onNoSavePopup?: () => void;
}) {
  const router = useRouter();
  const { goStep, currentStep, session, setSession } = useSession();

  const { userCheckout, updateUserCheckout } = useUser();
  const { currentSlug, getProductList } = useProducts();
  const { modelJsonText } = useMeta();
  const { setSidebarOpen } = useSidebar();

  const { next, prev, onSave } = calculateRouting(
    currentStep,
    userCheckout,
    updateUserCheckout,
    setSession,
    session,
    goStep
  );

  const goToNext = () => {
    if (!next) return;
    goStep(next);
  };

  const isProductStep = currentStep.step === STEPS.CHOSE_CATEGORY;

  const goToPrev = () => {
    setSidebarOpen(false);
    if (isProductStep) {
      router.push('/');
      return;
    }
    if (!prev) return;
    getProductList('');
    goStep(prev);
  };

  const isHomePage = router.pathname === '/';

  const isDraftPage =
    router.pathname === '/product' &&
    ![STEPS.CHOOSE_PRODUCT, STEPS.CHOSE_CATEGORY].includes(currentStep.step);

  const handleGoHome = () => {
    setSidebarOpen(false);
    if (isDraftPage) {
      const modelViewStateText = ModelView.Instance.getStateText();
      // if (canGoHomeWithoutSaving(lastSaveTime)) {
      if (modelJsonText === modelViewStateText) {
        router.push('/');
      } else {
        if (onNoSavePopup) {
          onNoSavePopup();
        }
      }
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {!isHomePage && (
        <UIButton
          className={classNames(s.headerButton, s.headerBack)}
          onClick={() => goToPrev()}
        >
          <UIIcon icon="IconArrowCollapse" />
        </UIButton>
      )}
      <UIButton
        className={classNames(s.headerButton, s.headerLogo)}
        onClick={handleGoHome}
      >
        <IconLogo />
      </UIButton>
    </>
  );
}
