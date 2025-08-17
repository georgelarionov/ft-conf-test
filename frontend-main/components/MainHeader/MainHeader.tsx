import s from './styles.module.scss';
import { UIButton } from '../UI/UIButton/UIButton';
import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import 'react-dropdown/style.css';
import { useMeta, useSession } from '../../hooks/providers';
import { STEPS } from '../../type';
import {
  ExportModel,
  ExportModelFormat,
} from '../ModelView/Exports/ExportModel';
// import { useOnClickOutside } from '../../hooks/useClickOutside';
import { MainHeaderLogo } from './MainHeaderLogo';
// import Link from 'next/link';
import { useCart } from '../../hooks/providers/CartProvider/CartProvider';
import { DateTime } from 'luxon';
import { useRouter } from '../../hooks/useRouter';
import { IconCart, IconSave, IconSettings } from '../UI/UIIcon/IconData';
import { ModelView } from '../ModelView/ModelView';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { useDrafts } from '../../hooks/useDrafts';
import { useSaveModel, useStateLoader } from '../../utils/draftUtils';
// import { canGoHomeWithoutSaving } from 'utils/common';
import { Designer, Customer, FTProduct, ICollection } from 'utils/dbModels';
import Button from '../UI/Button';
// import IconTop from '../../public/images/ToTop.svg';
import IconContextMenu from '../UI/UIIcon/IconData/icon-context-menu';
import IconGMenu from '../UI/UIIcon/IconData/icon-gMenu';
import { useSidebar } from '../../hooks/providers/SidebarProvider/SidebarProvider';
import { useIsMobile } from '../../hooks/mobileResolutionDetect';
import ThemeChanger from 'components/ThemeChanger/ThemeChanger';

export default function MainHeader({
  withLogo,
  onUnauthorizedCreate,
  onNoSavePopup,
}: {
  withLogo: boolean;
  onUnauthorizedCreate?: () => void;
  onNoSavePopup?: () => void;
}) {
  const router = useRouter();
  const { isAuthorized, user, setShowLoginModal, menuDrafts, menuCollections } =
    useAuth();

  const isCustomer = user instanceof Customer;
  const isDesigner = user instanceof Designer;

  const { updateCartState } = useCart();

  const { currentStep } = useSession();
  const { saveModel } = useSaveModel();

  const isDraftPage =
    router.pathname === '/product' &&
    ![STEPS.CHOOSE_PRODUCT, STEPS.CHOSE_CATEGORY].includes(currentStep.step);

  const isStartSteps = () =>
    currentStep.step != STEPS.CHOOSE_PRODUCT &&
    currentStep.step != STEPS.CHOSE_CATEGORY;

  const { navigateState, create } = useStateLoader();

  // const [exportOpened, setExportOpen] = useState(false);
  // const [draftsOpened, setDraftsOpened] = useState(false);
  // const [collectionsOpened, setCollectionsOpened] = useState(false);

  const isProductPurchased =
    ModelView?.Product && ModelView?.Product?.purchased;
    const isOriginalOwner = ModelView?.Product?.original_owner === user?._id;

  const closePanel = () => {
    setOpenedDropdown(null);
    // setExportOpen(false);
    // setDraftsOpened(false);
    // setCollectionsOpened(false);
  };

  const isMobileSize = useIsMobile();

  const { isAutoSaveLoading, modelJsonText } = useMeta();

  const [openedDropdown, setOpenedDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (openedDropdown === null) return;
      const ref = dropdownRefs.current[openedDropdown];
      // console.log('ref:'+(event?.target instanceof UIButton));
      if (ref && ref.contains(event.target as Node)) return;

      setOpenedDropdown(null);
    };

    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [openedDropdown]);

  // const { drafts, fetchDrafts } = useDrafts();
  const [loadedDrafts, setLoadedDrafts] = useState<FTProduct[] | null>(null);
  const [loadedCollections, setLoadedCollections] = useState<
    ICollection[] | null
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      // await fetchDrafts();
      setLoadedDrafts(menuDrafts);
      if (isDesigner) {
        setLoadedCollections(menuCollections);
      }
    };
    fetchData();
  }, [menuDrafts, menuCollections]);

  const handleGoHome = () => {
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

  const handleSave = async () => {
    if (!isAuthorized) {
      setShowLoginModal(true);
      return;
    }

    if (!ModelView.Product || !ModelView.Instance) {
      return;
    }

    if (!isAutoSaveLoading) {
      await saveModel(user);
    }
  };

  const handleCreate = () => {
    // console.log('Create Draft');
    closePanel();
    if (isAuthorized) {
      create(user);
    } else {
      if (onUnauthorizedCreate) {
        onUnauthorizedCreate();
      }
    }
  };

  const handleOpenCollection = collId => {
    router.push({
      pathname: '/create-collection',
      query: { id: collId },
    });
  };

  const handleCreateCollection = () => {
    // console.log('Create Collection');
    closePanel();
    if (isAuthorized) {
      router.push('/create-collection');
    } else {
      if (onUnauthorizedCreate) {
        onUnauthorizedCreate();
      }
    }
  };

  const handleSupport = () => {
    window.open(
      'https://shop.faithtribe.io/pages/faqs',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const { setSidebarOpen } = useSidebar();

  return (
    <>
      <div className={s.header}>
        {!isMobileSize ? (
          <div className={s.content}>
            <div className={s.left}>
              {withLogo && (
                <div className={s.border}>
                  <MainHeaderLogo onNoSavePopup={onNoSavePopup} />
                </div>
              )}
              {/* <Link href={'/'}> */}
              <UIButton
                className={classNames(
                  s.headerButton,
                  s.headerDashboard,
                  router.pathname === '/' && s.active
                )}
                onClick={handleGoHome}
              >
                HOME
              </UIButton>
              {/* </Link> */}
              <>
                <div
                  onClick={e => {
                    e.stopPropagation();
                    setOpenedDropdown(0);
                  }} // setDraftsOpened(true)}
                  className={classNames(s.headerButton, s.headerDashboard, s.fixedHeader)}
                >
                  DRAFTS
                  <div
                    className={classNames({
                      [s.drafts]: true,
                      [s.opened]: openedDropdown === 0, // draftsOpened,
                    })}
                    // ref={dropdownRef}
                    ref={el => (dropdownRefs.current[0] = el) as any}
                  >
                    {loadedDrafts?.slice(0, 5).map(draft => (
                      <UIButton
                        key={draft._id}
                        onClick={e => {
                          // e.stopPropagation();
                          navigateState(draft);
                          closePanel();
                        }}
                        className={s.exportButton}
                      >
                        {draft.data?.title ? draft.data?.title : '(No title)'}{' '}
                        <span>
                          {DateTime.fromISO(draft.createdAt).toLocaleString()}
                        </span>
                      </UIButton>
                    ))}
                    <UIButton
                      onClick={e => {
                        // e.stopPropagation();
                        handleCreate();
                      }}
                      className={s.exportButton}
                    >
                      Create new
                    </UIButton>
                  </div>
                </div>
              </>
              {isDesigner && (
                <>
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      setOpenedDropdown(1);
                    }} // setCollectionsOpened(true)}
                    className={classNames(s.headerButton, s.headerDashboard, s.fixedHeader)}
                  >
                    COLLECTIONS
                    <div
                      className={classNames({
                        [s.collections]: true,
                        [s.opened]: openedDropdown === 1, // collectionsOpened,
                      })}
                      // ref={dropdownRef2}
                      ref={el => (dropdownRefs.current[1] = el as any)}
                    >
                      {loadedCollections?.slice(0, 5).map(collection => {
                        const collectionName = collection.name;

                        return (
                          <UIButton
                            key={collection._id}
                            onClick={e => {
                              e.stopPropagation();
                              // navigateState(collection);
                              handleOpenCollection(collection._id);
                              closePanel();
                            }}
                            className={s.exportButton}
                          >
                            {collectionName ? collectionName : '(No title)'}{' '}
                            <span>
                              {DateTime.fromISO(
                                collection.createdAt
                              ).toLocaleString()}
                            </span>
                          </UIButton>
                        );
                      })}
                      <UIButton
                        onClick={e => {
                          // e.stopPropagation();
                          handleCreateCollection();
                        }}
                        className={s.exportButton}
                      >
                        Create new
                      </UIButton>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={s.right}>
              {isStartSteps() && isDraftPage && isOriginalOwner && !isProductPurchased && (
                <UIButton className={s.headerButton} onClick={handleSave}>
                  {isAutoSaveLoading ? (
                    <Loader size={LOADER_SIZE.SMALL} />
                  ) : (
                    <IconSave />
                  )}
                </UIButton>
              )}
              <UIButton className={s.headerButton} onClick={handleSupport}>
                FAQ
              </UIButton>
              {isStartSteps() && isDraftPage && isProductPurchased && (
                <UIButton
                  onClick={e => {
                    if (!isAuthorized) {
                      setShowLoginModal(true);
                      return;
                    }
                    e.stopPropagation();
                    // setExportOpen(true);
                    setOpenedDropdown(2);
                  }}
                  className={classNames(s.headerButton, s.exportHeaderButton)}
                >
                  EXPORT
                </UIButton>
              )}
              <div
                className={classNames({
                  [s.exportActionsCustomer]: isCustomer,
                  [s.exportActions]: true,
                  [s.opened]: openedDropdown === 2, // exportOpened,
                })}
                ref={el => (dropdownRefs.current[1] = el as any)}
              >
                <UIButton
                  onClick={() => {
                    closePanel();
                    ExportModel.export(ExportModelFormat.USDZ, true, 1024);
                  }}
                  className={s.exportButton}
                >
                  AR / USDZ
                </UIButton>
                <UIButton
                  className={s.exportButton}
                  onClick={() => {
                    ExportModel.export(ExportModelFormat.GLB, true, 1024);
                    closePanel();
                  }}
                >
                  GLB / 3D
                </UIButton>
              </div>
              <div className={s.themeSection}>
                <ThemeChanger />
              </div>
              {isCustomer && (
                <UIButton
                  className={s.headerButton}
                  onClick={() => updateCartState(true)}
                >
                  <IconCart />
                </UIButton>
              )}
            </div>
          </div>
        ) : (
          <div className={s.mobileContent}>
            <div className={s.buttonGroup}>
              <Button
                variant="round"
                centreIcon={<IconGMenu />}
                onClick={() => setSidebarOpen(true)}
              />
            </div>
            <div className={s.buttonGroup}>
              {/*<div className={s.themeSection}>*/}
                <ThemeChanger />
              {/*</div>*/}
              <Button variant="round" centreIcon={<IconSettings />} />
              {isCustomer && (
                <Button
                  variant="round"
                  centreIcon={<IconCart />}
                  onClick={() => {
                    if (isMobileSize) {
                      updateCartState(true);
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
