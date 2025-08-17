import { useState, useEffect, useCallback } from 'react';

import { isClient } from '../utils/client';

const useWindowDimensions = () => {
  const hasWindow = isClient;

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : 0;
    const isMobile = width ? width < 481 : false;
    const isTablet = width ? width >= 481 && width < 1025 : false;
    return { isMobile, isTablet, width };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [getWindowDimensions, hasWindow]);

  return windowDimensions;
};

export default useWindowDimensions;
