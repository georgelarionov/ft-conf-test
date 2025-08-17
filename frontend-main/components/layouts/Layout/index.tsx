import ContextMenu from '../../UI/ContextMenu';

import SlideButton from '../../UI/SlideButton';
import css from './auth.module.scss';

import {
    IconAvatar,
    IconCollections,
    IconHome,
    IconScratch,
    IconSettings,
    IconSupport,
    IconClose,
} from '../../UI/UIIcon/IconData';
import { MainHeaderLogo } from '../../MainHeader/MainHeaderLogo';
import React, { useEffect, useState } from 'react';
import { UIButton } from '../../UI/UIButton/UIButton';
import { shopifyLogin } from '../../../utils/common';
import { useAuth } from '../../../hooks/providers/AuthProvider/AuthProvider';
import { categories } from 'hooks/providers/CategoriesProvider/categories';
import { useRouter } from '../../../hooks/useRouter';
import Link from 'next/link';
import Version from 'components/Version/Version';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { useStateLoader } from '../../../utils/draftUtils';
import { STEPS } from '../../../type';
import { useSidebar } from '../../../hooks/providers/SidebarProvider/SidebarProvider';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import useWindowDimensions from 'hooks/useWindowDemention';
import { useDrafts } from "../../../hooks/useDrafts";
import { useMeta } from "../../../hooks/providers";


export const Layout = ({ children }: any) => {
    return <div className={css.container}>{children}</div>;
};

export const LayoutSidebar = ({
                                  onUnauthorizedCreate,
                                  onLogin,
                                  onNoSavePopup,
                              }: {
    onUnauthorizedCreate?: () => void;
    onLogin?: () => void;
    onNoSavePopup?: () => void;
}) => {
    const { user, isAuthorized, logout, updateAuthState, isLoading, menuCollections } = useAuth();
    const { isOpen, setSidebarOpen } = useSidebar();
    const { isTablet } = useWindowDimensions();

    const router = useRouter();

    const { create } = useStateLoader();

    // const isMobileSize = useIsMobile();
    const isMobileSize = useMeta();


    useEffect(() => {
        updateAuthState();
    }, [updateAuthState]);

    const handleCreate = (title: string | null = null) => {
        if (isAuthorized) {
            create(user, title);
        } else {
            if (onUnauthorizedCreate) {
                onUnauthorizedCreate();
            }
        }
        if (isMobileSize.isMobile) {
            setSidebarOpen(false);
        }
    };

  const handleProfile = () => {
    router.push('/profile');
    // window.open(
    //   'https://shop.faithtribe.io/account',
    //   '_blank',
    //   'noopener,noreferrer'
    // );
    if (isMobileSize) {
      setSidebarOpen(false);
    }
  };

    const handleOpenCollection = (collId) => {
        router.push({
            pathname: '/create-collection',
            query: { id: collId }
        });
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div
            className={
                isMobileSize.isMobile
                    ? `${css.sidebar} ${!isOpen ? css.sidebarClosed : css.sidebarOpened}`
                    : css.simpleSidebar
            }
        >
            <div className={css.header}>
                <MainHeaderLogo onNoSavePopup={onNoSavePopup}/>
                {isMobileSize.isMobile && (
                    <button
                        className={css.closeBurger}
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <IconClose/>
                    </button>
                )}
            </div>
            <div className={css.asideContent}>
                <div className={css.groupSlideButtons}>
                    <SlideButton
                        className={css.headSlideButton}
                        open={router.pathname.includes('myitems')}
                        icon={<IconHome/>}
                        items={[
                            {
                                title: 'My wardrobe',
                                onClick: () => {
                                    router.push('/myitems');
                                    setSidebarOpen(false);
                                },
                            },
                        ]}
                    >
                        Home
                    </SlideButton>
                    <SlideButton
                        className={css.headSlideButton}
                        icon={<IconScratch/>}
                        items={categories.map(({ title }) => ({
                            title: title,
                            onClick: () => {
                                handleCreate(title);
                                setSidebarOpen(false);
                            },
                        }))}
                    >
                        Create from scratch
                    </SlideButton>
                    <SlideButton
                        className={css.headSlideButton}
                        icon={<IconCollections/>}
                        // items={[{ title: 'Coming soon', onClick: () => { if (isMobileSize) setSidebarOpen(false); } }]}
                        items={menuCollections?.map((collection) => ({
                            title: collection.name,
                            onClick: () => {
                                handleOpenCollection(collection._id);
                                if (isMobileSize.isMobile) setSidebarOpen(false);
                            }
                        }))}
                    >
                        Collections
                    </SlideButton>
                    <SlideButton
                        open={true}
                        className={css.headSlideButton}
                        icon={<IconSupport/>}
                        items={[
                            {
                                title: 'Run Thru Guide',
                                onClick: () => {
                                    router.push('/guide');
                                    setSidebarOpen(false);
                                },
                            },
                        ]}
                    >
                        Support
                    </SlideButton>
                </div>
            </div>
            <div className={css.footer}>
                {/* <SlideButton
          open={true}
          className={css.slideButton}
          icon={<IconSupport />}
          items={[
            { title: 'Run Thru Guide', onClick: () => { router.push('/guide'); if (isMobileSize) setSidebarOpen(false); } },
          ]}
        >
          Support
        </SlideButton> */}
                {!isMobileSize.isMobile && (
                    <SlideButton
                        className={css.slideButtonInactive}
                        icon={<IconSettings/>}
                        items={[]}
                        active={false}
                    >
                        Settings
                    </SlideButton>
                )}

                {isLoading ? (
                    <div className={css.userInfo}>
                        <Loader centered size={LOADER_SIZE.NORMAL}/>
                    </div>
                ) : (
                    <>
                        {isAuthorized && (
                            <div className={css.userInfo}>
                                <div className={css.avatar}>
                                    {isTablet ? (
                                        <ContextMenu
                                            position="top"
                                            items={[
                                                {
                                                    title: 'Logout',
                                                    onClick: () => logout(),
                                                },
                                            ]}
                                        >
                                            <IconAvatar/>
                                        </ContextMenu>
                                    ) : (
                                        <IconAvatar/>
                                    )}
                                </div>
                                {!isTablet && (
                                    <>
                                        <div className={css.user} onClick={handleProfile}>
                                            <div className={css.name}>
                                                {user?.first_name} {user?.last_name}
                                            </div>
                                            <div className={css.email}>{user?.email}</div>
                                        </div>
                                        <div>
                                            <ContextMenu
                                                position="top"
                                                items={[
                                                    {
                                                        title: 'Logout',
                                                        onClick: handleLogout,
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {!isAuthorized && (
                            <div className={css.unauth}>
                                <UIButton
                                    className={css.headerButton}
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        if (onLogin) onLogin()
                                    }}
                                >
                                    Login
                                </UIButton>
                                {/* <UIButton className={css.headerButton}>Registration</UIButton> */}
                            </div>
                        )}
                    </>
                )}
                {!isMobileSize.isMobile && <Version/>}
            </div>
        </div>
    );
};

export const LayoutContent = ({ children }: any) => {
    return <div className={css.content}>{children}</div>;
};
