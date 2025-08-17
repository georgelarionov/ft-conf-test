import React, { useRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';

import s from './styles.module.css';

type Props = {
  children: any,
  className?: string;
  index?: number;
  onChange?: (index: number) => void;
  indicators?: (currentIndex: number) => React.ReactElement;
  actionLeft?: (
    onChange: (index: number) => void,
    currentIndex: number
  ) => React.ReactElement;
  actionRight?: (
    onChange: (index: number) => void,
    currentIndex: number
  ) => React.ReactElement;
};

const CHANGE_OFFSET = 0.5;

export const HScroll: React.FC<Props> = ({
  children,
  className,
  onChange = _noop,
  actionRight,
  actionLeft,
  indicators,
  index = 0,
}) => {
  const timer = useRef<any>(null);
  const container = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const buffer = useRef<HTMLDivElement>(null);
  const childrenWidths = useRef<
    { width: number; length: number; change: number }[]
  >([]);
  const [state, setState] = useState({
    index: 0,
    translating: false,
    sliding: false,
  });

  const dropTimer = () => {
    clearTimeout(timer.current as any);
    timer.current = null;
  };

  const ss = useRef({
    start: 0,
    currentTranslate: 0,
    translate: 0,
    maxTranslate: 0,
    wasMoving: false,
  });

  const handleMouseMove = e => {
    if (!e.targetTouches) {
      e.stopPropagation();
      e.preventDefault();
    }
    const clientX = e.clientX || e.targetTouches[0].clientX;
    if (!ss.current.start) {
      ss.current = {
        ...ss.current,
        start: clientX,
        wasMoving: true,
      };

      setState(prev => ({ ...prev, translating: true }));
    }

    if (Math.abs(ss.current.translate) > 10) {
      buffer.current!.style.display = 'flex';
    }
    const offset = ss.current.start - clientX;
    const translate = ss.current.currentTranslate - offset;
    ss.current.translate = translate;
    slider.current!.style.transform = `translateX(${translate}px)`;
  };

  const onTouchStart = e => {
    if (!e.targetTouches) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!container.current) return;

    container.current!.addEventListener('mousemove', handleMouseMove);
    container.current!.addEventListener('touchmove', handleMouseMove);
    slider.current!.addEventListener('mouseup', onTouchEnd);
    slider.current!.addEventListener('touchend', onTouchEnd);
    container.current!.addEventListener('mouseleave', onTouchEnd);
  };

  const onTouchEnd = e => {
    if (!e.targetTouches) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!container.current) return;

    if (ss.current.wasMoving) {
      ss.current = {
        ...ss.current,
        start: 0,
      };
      childrenWidths.current.find(({ width, length, change }, i, arr) => {
        const translate = Math.abs(ss.current.translate);
        const isLessThenMin =
          translate < arr[0].change || ss.current.translate > 0;
        const isGraterThenMax = translate > Math.abs(ss.current.maxTranslate);
        const isCompare = translate >= change && translate < arr[i + 1].change;
        if (isLessThenMin || isGraterThenMax || isCompare) {
          let value = -length;
          let currentIndex = i;
          if (isGraterThenMax) {
            value = ss.current.maxTranslate;
            currentIndex = arr.length - 1;
          }
          if (isLessThenMin) {
            value = 0;
            currentIndex = 0;
          }
          setState(prev => ({
            ...prev,
            index: currentIndex,
          }));
          ss.current = {
            ...ss.current,
            currentTranslate: value,
            translate: 0,
            wasMoving: false,
          };
          return true;
        }
        return false;
      });

      setState(prev => ({
        ...prev,
        translating: false,
      }));
    }
    buffer.current!.style.display = 'none';
    container.current.removeEventListener('mousemove', handleMouseMove);
    container.current.removeEventListener('touchmove', handleMouseMove);
    slider.current!.removeEventListener('mouseup', onTouchEnd);
    slider.current!.removeEventListener('touchend', onTouchEnd);
    container.current.removeEventListener('mouseleave', onTouchEnd);
  };

  const handleChangeIndex = (index: number) => {
    const actualIndex = Math.max(
      Math.min(index, childrenWidths.current.length - 1),
      0
    );
    const translate =
      childrenWidths.current[actualIndex].length -
      childrenWidths.current[actualIndex].width;
    setState(prev => ({ ...prev, index: actualIndex }));
    const offset = Math.max(ss.current.maxTranslate, -translate);
    ss.current.currentTranslate = offset;
    slider.current!.style.transform = `translateX(${offset}px)`;
  };

  useEffect(() => {
    setTimeout(() => {
      if(!slider.current) {
        return
      }
      const childrenArr = Array.from(slider.current!.children);
      ss.current.maxTranslate = (container.current as HTMLElement).offsetWidth;
      let currentLength = 0;
      for (let i = 1; i < childrenArr.length; i += 1) {
        const widthElem = (childrenArr[i] as HTMLElement).offsetWidth;
        currentLength += widthElem;
        childrenWidths.current[i - 1] = {
          width: widthElem,
          length: currentLength,
          change: currentLength - widthElem * CHANGE_OFFSET,
        };
        ss.current.maxTranslate -= widthElem;
      }

      buffer.current!.style.width = `${
        slider.current!.offsetWidth + Math.abs(ss.current.maxTranslate)
      }px`;
      if (index) {
        handleChangeIndex(index);
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (!state.translating) {
      slider.current!.style.transform = `translateX(${ss.current.currentTranslate}px)`;
      // setTimeout(() => {
      //   buffer.current!.style.display = 'none';
      // }, 0);
    }
  }, [state.translating]);

  useEffect(() => {
    onChange(state.index);
  }, [state.index]);

  return (
    <div
      className={classnames(`${s.scroll} h-scroll`, className)}
      ref={container}
    >
      {!!actionRight && actionRight(handleChangeIndex, state.index)}
      {!!actionLeft && actionLeft(handleChangeIndex, state.index)}
      <div
        ref={slider}
        className={classnames({
          [s.scrollContent]: true,
        })}
        onMouseDown={onTouchStart}
        onTouchStart={onTouchStart}
        style={{
          transition: !state.translating ? 'transform 0.3s' : 'none',
        }}
      >
        <div
          ref={buffer}
          className={classnames({
            [s.buffer]: true,
          })}
        />
        {(children as any[]).map(child => {
          return (
            <div key={child.key} className="hScroll__item">
              {child}
            </div>
          );
        })}
      </div>
      {!!indicators && indicators(state.index)}
    </div>
  );
};
