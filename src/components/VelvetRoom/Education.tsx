import { cx } from '../../utils/cx.ts';
import { useEducation } from './useEducation.ts';
import styles from './Education.module.css';

/** Compact "Training" row under the contracts: schools as skewed paper tabs. */
export const Education = () => {
  const rows = useEducation();
  return (
    <div className={styles.training}>
      <p className={cx('label', styles.title)}>
        <span>Training</span>
      </p>
      <ul className={styles.tabs} aria-label="Training">
        {rows.map((row) => (
          <li key={row.key} className={styles.tab}>
            <span>{row.school}</span>
            <span className={styles.place}>{row.place}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
