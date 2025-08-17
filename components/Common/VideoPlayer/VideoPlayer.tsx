import React, { useState, useEffect, useRef } from 'react';
import { UIRangeSlider } from 'components/UI/UIRangeSlider/UIRangeSlider';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { useSession } from 'hooks/providers';
import { beautifyTime } from 'utils/time';

import s from './styles.module.css';
import classnames from 'classnames';
import { ModelView } from '../../ModelView/ModelView';
import { ExportVideo } from "../../ModelView/Exports/ExportVideo";

export const VideoPlayer = ({ className = '' }) => {
  const timer = useRef<any>(null);
  const { session, setSession } = useSession();
  const {
    video: { duration, playing, rotateCount, background },
  } = session;
  const [state, setState] = useState({
    currentTime: 0,
    recordBackground: null,
  } as { currentTime: number, recordBackground: string|null });

  const handlePlay = () => {
    setSession({ video: { ...session.video, playing: true } });

    ExportVideo.export(
      duration || 0,
      rotateCount,
      !!state.recordBackground,
      state.recordBackground as string,
      true
    );
  };

  const clearTimer = () => {
    clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    setState(prev => ({ ...prev, recordBackground: background }));

    clearTimer();
    if (playing) {
      timer.current = setInterval(() => {
        setState(prev => ({ ...prev, currentTime: prev.currentTime + 1 }));
      }, 1000);
    } else {
      setState(prev => ({ ...prev, currentTime: 0 }));
    }
  }, [playing]);

  useEffect(() => {
    if (state.currentTime > duration) {
      setSession({ video: { ...session.video, playing: false } });
      ModelView.Instance.record.isRecording = false;
      ModelView.Instance.setClearColor(background, !!background ? 1 : 0);
    }
  }, [state.currentTime]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  if (!duration) {
    return null;
  }

  return (
    <div className={classnames(s.player, className)}>
      {!playing && (
        <UIIcon icon="play" className={s.playIcon} onClick={handlePlay} />
      )}
      {playing && (
        <span className={s.timer}>{beautifyTime(state.currentTime)}</span>
      )}
      <UIRangeSlider
        max={duration}
        min={0}
        value={state.currentTime}
        onChange={() => {}}
      />
    </div>
  );
};
