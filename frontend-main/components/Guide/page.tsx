import css from './page.module.scss';
import { Layout, LayoutContent, LayoutSidebar } from '../layouts/Layout';
import MainHeader from '../MainHeader/MainHeader';
import React from 'react';
import { Cart } from '../Cart/Cart';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';

const SHOPIFY_ACCOUNT_URL = 'https://shop.faithtribe.io/account';

export default function GuidePage() {
    // const { user, isAuthorized } = useAuth();
    
    return (
        <>
            <Layout>
                <LayoutSidebar />
                <LayoutContent>
                    <MainHeader withLogo={false} />
                    <div className={css.content}>
                        <div className={css.title}>
                            Run Thru Guide
                        </div>
                        <div>
                            <video
                                className={css.runthru_guide_video}
                                src="/runthru_guide.mp4"
                                autoPlay={false}
                                loop
                                muted={false}
                                width={'85%'}
                                controls={true}
                            />
                        </div>
                    </div>
                </LayoutContent>
            </Layout>
            <Cart />
        </>
    );
}
