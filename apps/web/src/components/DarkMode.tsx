import {
  BsFillMoonStarsFill,
  BsSunFill,
} from 'react-icons/bs';

import { useTheme } from '../context';

import styles from './DarkMode.module.css';

type DarkModeProps = {
  size?: number;
};

function DarkMode({
  size = 17,
}: DarkModeProps) {
  const {
    isDarkTheme,
    toggleDarkTheme,
  } = useTheme();

  const nextThemeLabel = isDarkTheme
    ? 'Switch to light mode'
    : 'Switch to dark mode';

  return (
    <button
      className={styles.button}
      type="button"
      onClick={toggleDarkTheme}
      aria-label={nextThemeLabel}
      aria-pressed={isDarkTheme}
      title={nextThemeLabel}
    >
      {isDarkTheme ? (
        <BsFillMoonStarsFill
          className={styles.icon}
          size={size}
          aria-hidden="true"
        />
      ) : (
        <BsSunFill
          className={styles.icon}
          size={size}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default DarkMode;