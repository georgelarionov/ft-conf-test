import { createContext, useContext, useState } from 'react';
import MobileDetect from 'mobile-detect';
import { ModelView } from 'components/ModelView/ModelView';

const MetaContext = createContext<{
  isMobile: boolean;
  device: 'tablet' | 'mobile' | 'desktop';
  detectDevice: (userAgent: string) => void;
  isAutoSaveLoading: boolean;
  setIsAutoSaveLoading: (flag: boolean) => void;
  // lastSaveTime: number;
  // updateLastSaveTime: () => void;
  modelJsonText: string;
  updateModelJsonText: (txt: string) => void;
}>({
  isMobile: false,
  device: 'desktop',
  detectDevice: () => {},
  isAutoSaveLoading: false,
  setIsAutoSaveLoading: () => {},
  // lastSaveTime: new Date().getTime(),
  // updateLastSaveTime: () => {},
  modelJsonText: '',
  updateModelJsonText: () => {}
});

export const MetaProvider = ({ children, userAgent }) => {
  const [state, setState] = useState(() => {
    const md = new MobileDetect(userAgent);
    const device =
      (md.tablet() && 'tablet') || (md.mobile() && 'mobile') || 'desktop';
    return {
      device,
      isMobile: device === 'tablet' || device === 'mobile',
      isAutoSaveLoading: false,
      lastSaveTime: new Date().getTime(),
      modelJsonText: ''
    };
  });

  const detectDevice = (userAgent: string) => {
    const md = new MobileDetect(userAgent);
    const device =
      (md.tablet() && 'tablet') || (md.mobile() && 'mobile') || 'desktop';
    setState(prev => ({
      ...prev,
      device,
      isMobile: device === 'tablet' || device === 'mobile',
    }));
  };

  const setIsAutoSaveLoading = (flag: boolean) => {
    setState(prev => ({
      ...prev,
      isAutoSaveLoading: flag,
    }));
  };

  // const updateLastSaveTime = () => {
  //   setState(prev => ({
  //     ...prev,
  //     lastSaveTime: new Date().getTime()
  //   }));
  // };

  const updateModelJsonText = (txt: string) => {
    setState(prev => ({
      ...prev,
      modelJsonText: txt
    }));
  };

  return (
    <MetaContext.Provider
      value={{
        isMobile: state.isMobile,
        device: state.device as any,
        detectDevice,
        isAutoSaveLoading: state.isAutoSaveLoading,
        setIsAutoSaveLoading,
        // lastSaveTime: state.lastSaveTime,
        // updateLastSaveTime,
        modelJsonText: state.modelJsonText,
        updateModelJsonText
      }}
    >
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
