import {
  createContext,
  useContext,
  useEffect,
} from 'react';

import type { ReactNode } from 'react';

import { useLocalStorage } from '../hooks';

type ThemeContextValue = {
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const THEME_STORAGE_KEY =
  'skillflow-dark-theme';

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    isDarkTheme,
    setIsDarkTheme,
  ] = useLocalStorage<boolean>(
    THEME_STORAGE_KEY,
    true,
  );

  useEffect(() => {
    const rootElement =
      document.documentElement;

    rootElement.classList.toggle(
      'dark-theme',
      isDarkTheme,
    );

    rootElement.style.colorScheme =
      isDarkTheme ? 'dark' : 'light';

    const themeColorMeta =
      document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );

    themeColorMeta?.setAttribute(
      'content',
      isDarkTheme
        ? '#151515'
        : '#ffffff',
    );
  }, [isDarkTheme]);

  const toggleDarkTheme = () => {
    setIsDarkTheme(
      (currentTheme) => !currentTheme,
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme,
        toggleDarkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider.',
    );
  }

  return context;
}