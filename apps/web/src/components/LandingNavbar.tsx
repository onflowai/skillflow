import { Link } from 'react-router-dom';

import skillFlowLogo from '../assets/skillflow-color.svg';

import DarkMode from './DarkMode';

import styles from './LandingNavbar.module.css';

function LandingNavbar() {
  return (
    <header className={styles.landingNavbar}>
      <div className={styles.content}>
        <Link
          className={styles.brand}
          to="/"
          aria-label="Go to the SkillFlow home page"
        >
          <img
            className={styles.logo}
            src={skillFlowLogo}
            alt=""
          />

          <span className={styles.brandName}>
            skillflowai
          </span>
        </Link>

        <div className={styles.actions}>
          <DarkMode />
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;