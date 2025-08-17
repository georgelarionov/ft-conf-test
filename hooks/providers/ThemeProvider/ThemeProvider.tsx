import React from 'react';
import { ThemeContext, themes } from './ThemeContext';

const THEME_KEY = 'theme';

const getTheme = () => {
  if (typeof window === 'undefined') return themes.light;

  const theme = `${window?.localStorage?.getItem(THEME_KEY)}`;
  console.log('theme: ', theme);
  if (Object.values(themes).includes(theme)) return theme;

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  if (userMedia.matches) return themes.dark;

  return themes.light;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState<string>();

  React.useEffect(() => {
    setTheme(getTheme());
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, String(theme));
  }, [theme]);

  React.useEffect(() => {
    setTheme(getTheme());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
