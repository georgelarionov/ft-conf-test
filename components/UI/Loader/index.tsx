'use client';

import { clsx } from 'clsx';

import animationData from '../../../assets/ft.json';

import css from './styles.module.css';
import { useEffect, useRef } from 'react';

export enum LOADER_SIZE {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
}

type TLoader = {
  className?: string;
  centered?: boolean;
  size?: LOADER_SIZE;
};

const Loader = ({ className, centered, size = LOADER_SIZE.LARGE }: TLoader) => {
  const animationRef = useRef(null);

  async function getLottie() {
    const lot = await import('lottie-web');

    lot.default.loadAnimation({
      autoplay: true,
      loop: true,
      animationData: animationData,
      container: animationRef.current!,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    });
  }
  useEffect(() => {
    getLottie();
  }, []);

  return (
    <div
      className={clsx(
        css.container,
        className,
        centered && css.centered,
        size && css[size]
      )}
    >
      <div ref={animationRef} />
    </div>
  );
};

export default Loader;
