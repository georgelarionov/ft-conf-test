import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { RootProvider } from 'hooks/providers/RootProvider';
import { initWebWorker } from 'utils/WebWorker/initWebWorker';
import { worker as webWorker } from 'utils/WebWorker/worker';
import MobileWarningBanner from 'components/MobileWarningBanner/MobileWarningBanner';
import { SidebarProvider } from '../hooks/providers/SidebarProvider/SidebarProvider';

import 'assets/global.scss';
import 'assets/react-tabs.scss';
import ModalLogin from 'components/ModalLogin';
export const worker = initWebWorker(webWorker) as any;

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [userAgent, setUserAgent] = useState('');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserAgent(navigator.userAgent);
        }
    }, []);

    return (
        <SidebarProvider>
            <RootProvider userAgent={userAgent}>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"} />
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
                    rel="stylesheet"
                />
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <MobileWarningBanner/>
                <Component {...pageProps} />
                {/* <ModalLogin/> */}
            </RootProvider>
        </SidebarProvider>
    );
};

export default MyApp;
