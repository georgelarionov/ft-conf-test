import React, { useEffect, useState } from 'react';
import { STEPS } from 'type';
import { settings } from './SettingsHelper';

import s from './styles.module.scss';
import { useSession, useUser } from '../../hooks/providers';
import { Collapse } from '@kunukn/react-collapse';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { UIButton } from '../UI/UIButton/UIButton';
import { StepContent } from '../MainActions/ActionContent/ActionContent';
import classNames from 'classnames';
import { calculateRouting } from '../MainActions/ActonsArrows/calculateRouting';
import { useRouter } from 'next/router';
import { ModelView } from '../ModelView/ModelView';
import { useSaveModel } from '../../utils/draftUtils';
import { useCart } from 'hooks/providers/CartProvider/CartProvider';
import { useMeta } from '../../hooks/providers';
import { AUTOSAVE_INTERVAL } from 'utils/common';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { useIsMobile } from '../../hooks/mobileResolutionDetect';
import useWindowDimensions from 'hooks/useWindowDemention';
import { Designer } from 'utils/dbModels';

export const Settings = () => {
  const { user } = useAuth();
  const { userCheckout } = useUser();
  const { session } = useSession();
  const { saveModel } = useSaveModel();
  const { visible } = useCart();
  const { isAutoSaveLoading, modelJsonText } = useMeta();
  const isMobileSize = useIsMobile();
  const [jsonText, setJsonText] = useState('');
  const { isTablet } = useWindowDimensions();

  const isDesigner = user instanceof Designer;
  const isProductPurchased = ModelView?.Product?.purchased;
//   const isProductFromDesignerCollection = ModelView?.Product.product_type === 'col';
console.log("ModelView?.Product?.collections:"+ModelView?.Product?.collections);
//   const isProductInPublishedInCollection = ModelView?.Product?._id in publishedCollections;
  const isOriginalOwner = ModelView?.Product?.original_owner === user?._id;
  const canSave = (!isProductPurchased && isOriginalOwner); // || (isDesigner && !isProductInPublishedInCollection); // !isProductFromDesignerCollection;

  useEffect(() => {
    if (!canSave) return;

    const time = setInterval(async () => {
      if (!ModelView.Product || !ModelView.Instance || visible) return;
      if (!isAutoSaveLoading) {
        const modelViewStateText = ModelView.Instance.getStateText();
        if (modelJsonText !== modelViewStateText) {
          const text = await saveModel(user);
          setJsonText(text);
        }
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      clearInterval(time);
    };
  }, [saveModel, userCheckout, isAutoSaveLoading, modelJsonText, visible]);

  return (
      <>
        {!isTablet && (
            <div className={s.catalogHeader}>
              {userCheckout?.product?.title}
              {!isMobileSize && <ExpandUpDown />}
            </div>
        )}
        <Tabs>
          <TabList>
            {isMobileSize && canSave ? (
                <Tab disabled={session.video?.recording} style={{ width: '100%' }}>
                  STYLE
                </Tab>
            ) : (
                <>
                {canSave &&
                  <Tab disabled={session.video?.recording}>STYLE</Tab>
                }
                  <Tab disabled={session.video?.recording}>SETTINGS</Tab>
                </>
            )}
          </TabList>
          {canSave &&
          <TabPanel>
            <div className={s.settings}>
              {settings.map(({ title, step, image }) => (
                  <StylePanel title={title} step={step} key={title} image={image} />
              ))}
            </div>
          </TabPanel>
            }
          <TabPanel>
            <div className={classNames(s.settings, s.settingsJson)}>
              <div className={s.jsonHeader}>
                <span>JSON</span>
                <button onClick={() => navigator.clipboard.writeText(jsonText)}>
                  <UIIcon icon="IconCopy" />
                  <span>COPY</span>
                </button>
              </div>
              <textarea
                  readOnly={true}
                  className={s.jsonInput}
                  cols={1}
                  rows={jsonText.split('\n').length}
                  value={jsonText}
              />
            </div>
          </TabPanel>
        </Tabs>
      </>
  );
};

const StylePanel = ({
                      title,
                      step,
                      image,
                    }: {
  title: string;
  step: STEPS;
  image: React.ReactNode;
}) => {
  const { goStep, currentStep, session, setSession } = useSession();
  const { userCheckout, updateUserCheckout } = useUser();
  const { onSave } = calculateRouting(
      currentStep,
      userCheckout,
      updateUserCheckout,
      setSession,
      session,
      goStep
  );
  const isMobileSize = useIsMobile();
  const { isTablet } = useWindowDimensions();

  // Обработчик клика, который переключает «активный» шаг:
  const handleClick = (targetStep: STEPS) => {
    if (onSave) {
      onSave();
    }
    // Если уже на этом шаге – переключаемся в "SETTINGS" (сброс).
    // Иначе переходим на целевой шаг.
    goStep(currentStep.step === targetStep ? STEPS.SETTINGS : targetStep);
  };

  const isActive = currentStep.step === step;

  return (
      <div className={s.stylePanel}>
        <UIButton
            disabled={session.video?.recording}
            onClick={() => handleClick(step)}
            className={classNames(
                s.collapseButton,
                s.collapseButton, // Если нужно продублировать класс
                {
                  [s.select]: isActive,
                  [s.unselect]: !isActive,
                }
            )}
        >
          {image}
          {!isMobileSize && !isTablet && title}
          <ArrowUpDown flip={isActive} />
        </UIButton>

        {/* Для мобильной версии содержимое панели выводить не нужно – оно рендерится отдельно */}
        {!isMobileSize && (
            <>
              <div
                  className={classNames(s.collapseBackground, {
                    [s.open]: isActive,
                  })}
                  onClick={() => handleClick(STEPS.SETTINGS)}
              />
              <Collapse
                  isOpen={isActive}
                  noAnim={true}
                  className={classNames(s.collapseWrapper, s.collapseCssTransition)}
              >
                {(state) => (state === 'expanded' ? <StepContent step={step} /> : null)}
              </Collapse>
            </>
        )}
      </div>
  );
};

const ArrowUpDown = ({ flip }: { flip: boolean }) => {
  return (
      <div className={classNames(s.arrowDown, { [s.arrowDownFlip]: flip })}>
        <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M10.5 1L5.5 6L0.500001 1"
              stroke="black"
              strokeLinecap="round"
          />
        </svg>
      </div>
  );
};

const ExpandUpDown = () => {
  return (
      <div className={s.arrowDown}>
        <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.5 7.5L6 2L0.5 7.5" stroke="black" strokeLinecap="round" />
          <path
              d="M11.5 12.5L6 18L0.5 12.5"
              stroke="black"
              strokeLinecap="round"
          />
        </svg>
      </div>
  );
};
