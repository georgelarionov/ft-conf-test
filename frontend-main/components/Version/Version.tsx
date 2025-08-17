// components/Version/Version.tsx

import s from './styles.module.css';

const VERSION = '1.4' + process.env.NEXT_PUBLIC_BUILD_TYPE;

export default function Version() {
  return (
    <div className={s.footer}>
      <div className={s.version}>{`v ${VERSION}`}</div>
    </div>
  );
}
