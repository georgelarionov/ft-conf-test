import { ThemeContext } from 'hooks/providers/ThemeProvider/ThemeContext';
import { IconLaptop, IconMoon, IconSun } from '../UI/UIIcon/IconData';
import s from './ThemeChanger.module.scss';
import clsx from 'clsx';
import { useIsMobile } from '../../hooks/mobileResolutionDetect'; // убедитесь, что путь корректный

export default function ThemeChanger() {
  const isMobileSize = useIsMobile();

  return (
      <ThemeContext.Consumer>
        {({ theme, setTheme }: any) => {
          const isDark = theme === 'dark';

          if (isMobileSize) {
            return (
                <div className={s.wrapper}>
                  <div className={s.themeChanger}>
                    <button
                        className={clsx(s.button, isDark ? s.active : '')}
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    >
                      {isDark ? <IconMoon /> : <IconSun />}
                    </button>
                  </div>
                </div>
            );
          }
          return (
              <div className={s.wrapper}>
                <div className={s.themeChanger}>
                  {/* <button
              className={clsx(s.button, theme === 'system' && s.active)}
              onClick={() => setTheme('system')}
            >
              <IconLaptop />
            </button> */}
                  <button
                      className={clsx(s.button, isDark ? s.active : '')}
                      onClick={() => setTheme('dark')}
                  >
                    <IconMoon />
                  </button>
                  <button
                      className={clsx(s.button, !isDark ? s.active : '')}
                      onClick={() => setTheme('light')}
                  >
                    <IconSun />
                  </button>
                </div>
              </div>
          );
        }}
      </ThemeContext.Consumer>
  );
}
