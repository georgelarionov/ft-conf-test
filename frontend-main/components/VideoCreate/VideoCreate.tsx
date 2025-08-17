import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import { STEPS, UserCheckout } from 'type';
import classnames from 'classnames';
import { VideoPlayer } from 'components/Common/VideoPlayer/VideoPlayer';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { UIRangeSliderValues } from 'components/UI/UIRangeSliderValues/UIRangeSliderValues';
import { UICheckboxRow } from 'components/UI/UICheckboxRow/UICheckboxRow';
import { ColorPicker } from 'components/Common/ColorPicker/ColorPicker';
import { useMeta, useSession, useUser } from 'hooks/providers';
import { ModelView } from '../ModelView/ModelView';
import { DownloadPopup } from './DownloadPopup/DownloadPopup';

import s from './styles.module.css';
import testUtils from '../../utils/testUtils';
import { ExportVideo } from '../ModelView/Exports/ExportVideo';

export const VideoCreate = () => {
  const { setSession, session, currentStep } = useSession();
  const { userCheckout, updateUserCheckout } = useUser();
  const { isMobile } = useMeta();
  const {
    video: { duration, rotateCount, background = '', recording, playing } = {},
  } = session;

  const [state, setState] = useState({
    useBackground: false,
  });

  const onChange = ({ target: { value, name } }) => {
    setSession({ video: { ...session.video, [name]: Number(value) } });
  };

  const changeRotateCount = (type: 'inc' | 'dec') => () => {
    const currentValue = session.video?.rotateCount || 0;
    const value = type === 'inc' ? currentValue + 1 : currentValue - 1;
    setSession({
      video: { ...session.video, rotateCount: Math.max(0, value) },
    });
  };

  const onColorChange = (color: UserCheckout['color']) => {
    ModelView.Instance.setClearColor(color.hex, state.useBackground ? 1 : 0);
    setSession({ video: { ...session.video, background: color.hex } });
  };

  const handleUseBackground = (active: boolean, name: string) => {
    ModelView.Instance.setClearColor(background, !active ? 0 : 1);
    if (!active) {
      setSession({ video: { ...session.video, background: null } });
    }
    setState(prev => ({ ...prev, [name]: active }));
  };

  const handleRecord = async () => {
    setSession({ video: { ...session.video, recording: true } });
    updateUserCheckout({ video: { ...userCheckout.video, videoUrls: {} } });
    const urls = await ExportVideo.export(
      duration || 0,
      rotateCount || 1,
      state.useBackground,
      background
    );

    updateUserCheckout({
      video: { ...userCheckout.video, videoUrls: urls || {} },
    });
    setSession({ video: { ...session.video, recording: false } });
  };

  useLayoutEffect(() => {
    return () => {
      ModelView.Instance.setClearColor('#fff', 1);
    };
  }, []);

  const getMaxDuration = () => {
    return testUtils.iOSSafari ? 7 : 10;
  };

  useEffect(() => {
    const {
      duration = getMaxDuration(),
      rotateSpeed = 12,
      rotateCount = 1,
    } = userCheckout.video || {};
    setSession({ video: { duration, rotateSpeed, rotateCount } });
  }, []);

  useEffect(() => {
    updateUserCheckout({ video: { ...userCheckout.video, videoUrls: {} } });
  }, [
    session.video.duration,
    session.video.rotateSpeed,
    session.video.rotateCount,
  ]);

  const recordHandler = useCallback(() => {
    if (!playing) {
      handleRecord();
    } else {
      setSession({ video: { ...session.video, playing: false } });
    }
  }, [session]);

  const btnText = playing
    ? 'cancel'
    : !recording
    ? 'start recording'
    : 'recording...';
  const isRecorded = !_isEmpty(userCheckout.video?.videoUrls);
  return (
    <div
      className={classnames({
        [s.videoSettings]: true,
      })}
    >
      <div
        className={classnames({
          pending: recording,
        })}
      >
        <UIRangeSliderValues
          title="Length"
          value={duration}
          onChange={onChange}
          name="duration"
          valuePostfix="s"
          max={getMaxDuration()}
        />
        <div className={s.rotate}>
          <div className={s.rotateCount}>
            <span className={s.rotateTitle}>Rotations</span>
          </div>
          <div className={s.buttons}>
            <button
              disabled={rotateCount === 0}
              onClick={changeRotateCount('dec')}
            >
              <UIIcon icon="minus" />
            </button>
            <span className={s.rotateCount}>{rotateCount}</span>
            <button onClick={changeRotateCount('inc')}>
              <UIIcon icon="IconAdd" />
            </button>
          </div>
        </div>
        <UICheckboxRow
          onChange={handleUseBackground}
          active={state.useBackground}
          label="Background"
          name="useBackground"
        />
        {state.useBackground && (
          <ColorPicker initialColor="#ffffff" onChange={onColorChange} />
        )}
        {isMobile && isRecorded && <VideoPlayer className={s.videoPlayer} />}
      </div>

      <div className={s.action}>
        {isMobile && <DownloadPopup className={s.download} />}
        <button
          className={classnames({
            [s.buttonRecord]: true,
            [s.playing]: playing,
          })}
          disabled={recording}
          onClick={recordHandler}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
};
