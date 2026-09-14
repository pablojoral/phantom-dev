import { confidentialNotice } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import styles from './ClassifiedNotice.module.css';

export interface ClassifiedNoticeProps {
  /** Fading out before it unmounts. */
  readonly leaving: boolean;
}

/** Stamp and strip over a confidential card. Decorative: the section's live region announces the text. */
export const ClassifiedNotice = ({ leaving }: ClassifiedNoticeProps) => (
  <div className={cx(styles.notice, leaving && styles.leaving)} aria-hidden="true">
    <p className={styles.stamp}>{confidentialNotice.stamp}</p>
    <p className={styles.strip}>
      <span>{confidentialNotice.message}</span>
    </p>
  </div>
);
