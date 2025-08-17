// components/MobileWarningBanner/MobileWarningBanner.tsx

import React, { useEffect, useState } from "react";
import s from './styles.module.scss';
import { isMobile } from "react-device-detect";

const BANNER_TIMEOUT = 60000;
const WARNING_MESSAGE = 'Best viewed on desktop/laptop or tablet devices';

export default function MobileWarningBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Detect if the app is running on a mobile  (Markus disable this)
    setShowBanner(isMobile);
  }, []);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, BANNER_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div className={`${s.mobile_banner} ${showBanner ? "slide_down" : "slide_up"}`}>
      {WARNING_MESSAGE}
    </div>
  );
};
