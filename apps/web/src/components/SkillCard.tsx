import styles from './SkillCard.module.css';

type SkillCardProps = {
  title: string;
  description: string;
  label: string;
};

function SkillCard({
  title,
  description,
  label,
}: SkillCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>

      <h2 className={styles.title}>{title}</h2>

      <p className={styles.description}>{description}</p>
    </article>
  );
}

export default SkillCard;