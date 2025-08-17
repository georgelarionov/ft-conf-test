import React, { useEffect, useState, useMemo } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { worker } from 'pages/_app';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { useUser } from 'hooks/providers';
import { eventHandler } from 'utils/WebWorker/initWebWorker';
import { CONVERTING_VIDEO_EVENT } from 'components/ModelView/Exports/ExportModel';
import { DownloadDropdown } from './DownloadDropdown/DownloadDropdown';
import { ProcessingPopup } from './ProcessingPopup/ProcessingPopup';
import p from './ProcessingPopup/styles.module.css';

import s from './styles.module.scss';
import { clamp } from 'three/src/math/MathUtils';
import ProgressBar from '@ramonak/react-progress-bar';
import classNames from 'classnames';

export const DownloadPopup = ({ onClose = () => {}, className = '' }) => {
  const { userCheckout } = useUser();
  const [state, setState] = useState({
    converting: true,
    showed: false,
  });

  const isRecorded = !_isEmpty(userCheckout.video?.videoUrls);

  const listenRecording = eventHandler(
    CONVERTING_VIDEO_EVENT,
    (type: string) => {
      setState(prev => ({ ...prev, converting: type === 'start' }));
    }
  );

  const handleClose = () => {
    setState(prev => ({ ...prev, showed: false }));
    onClose();
  };

  useEffect(() => {
    worker.addEventListener('message', listenRecording);
    return () => {
      worker.removeEventListener('message', listenRecording);
    };
  }, []);

  useEffect(() => {
    setState(prev => ({ ...prev, showed: isRecorded }));
  }, [isRecorded]);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(clamp(progress + 3, 0, 100));
    }, 300);
    return () => {
      clearInterval(interval);
    };
  });

  const videoUrl = useMemo(() => {
    if (!userCheckout.video?.videoUrls) return null;
    
    // Получаем URL видео (предпочтительно webm)
    const urls = userCheckout.video.videoUrls;
    const webmUrl = urls['webm'];
    const mp4Url = urls['mp4'];
    
    if (webmUrl && webmUrl instanceof Blob) {
      return URL.createObjectURL(webmUrl);
    } else if (mp4Url && mp4Url instanceof Blob) {
      return URL.createObjectURL(mp4Url);
    }
    
    return null;
  }, [userCheckout.video?.videoUrls]);

  useEffect(() => {
    // Освобождаем URL при размонтировании компонента
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <>
      {state.converting ||
        (state.showed && (
          <div
            className={classNames({
              [p.processing]: true,
              [p.showed]: state.showed,
              [p.withVideo]: state.showed && videoUrl,
            })}
          >
            <div className={p.title}>
              CREATE VIDEO
              <UIIcon icon="close" className={p.close} onClick={handleClose} />
            </div>
            <p>{!state.showed ? 'Loading progress' : 'Video ready'}</p>
            {state.converting && (
              <ProgressBar
                completed={progress}
                className={p.progress}
                bgColor="#000000"
                height="13px"
                isLabelVisible={false}
                baseBgColor="#EDEEF2"
                labelColor="#ffffff"
              />
            )}
            {state.showed && (
              <>
                {videoUrl && (
                  <div className={s.videoPreview}>
                    <video 
                      src={videoUrl} 
                      controls 
                      autoPlay 
                      loop 
                      muted
                      className={s.video}
                    />
                  </div>
                )}
                <div className={`${s.popup}`}>
                  <DownloadDropdown urls={userCheckout.video?.videoUrls} />
                </div>
              </>
            )}
          </div>
        ))}
    </>
  );
};
