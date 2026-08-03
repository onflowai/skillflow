import {
  HeroConway,
  SkillCard,
} from '../components';

import styles from './HomePage.module.css';

function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroConway />

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            BUILD IN PROGRESS:
          </p>

          <h1 className={styles.title}>
            skillflow 0.0.1
          </h1>

          <p className={styles.description}>

          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              type="button"
            >
              About
            </button>

            <button
              className={styles.secondaryButton}
              type="button"
            >
              CLI
            </button>
          </div>
        </div>
      </section>

      <section className={styles.cardGrid}>
        <SkillCard
          label="0.0.2"
          title="site"
          description="build the site which will host ability to brows and more for all skills and agents and docs"
        />

        <SkillCard
          label="0.0.3"
          title="cli"
          description="build the cli which will integrate with agents to retrieve those skills"
        />

        <SkillCard
          label="0.0.4"
          title="full integration with trendflow"
          description="integration with parent site to deliver more information to the users"
        />
      </section>
    </main>
  );
}

export default HomePage;