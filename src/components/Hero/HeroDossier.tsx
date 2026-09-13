import { cx } from '../../utils/cx.ts';
import { useHeroDossier } from './useHeroDossier.ts';
import styles from './HeroDossier.module.css';

export interface HeroDossierProps {
  readonly className?: string | undefined;
}

/** The "login form": the tagline as two filled-in fields, then the lede. */
export const HeroDossier = ({ className }: HeroDossierProps) => {
  const { fields, lede } = useHeroDossier();
  return (
    <div className={cx(styles.dossier, className)}>
      <div className={styles.panel}>
        <div className={styles.inner}>
          <dl className={styles.fields}>
            {fields.map((field) => (
              <div key={field.key} className={styles.field}>
                <dt className={styles.label}>{field.label}</dt>
                <dd className={styles.value}>
                  {field.tab !== undefined && (
                    <span className={styles.tab} aria-hidden="true">
                      <span>{field.tab}</span>
                    </span>
                  )}
                  <span className={styles.bar}>
                    <span>{field.value}</span>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className={styles.lede}>{lede}</p>
        </div>
      </div>
    </div>
  );
};
