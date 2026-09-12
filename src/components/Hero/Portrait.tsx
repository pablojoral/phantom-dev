import { photo } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { Panel } from '../Panel/Panel.tsx';
import { usePortrait } from './usePortrait.ts';
import styles from './Portrait.module.css';

export const Portrait = () => {
  const { missing, onError, tabText } = usePortrait();
  return (
    <div className={styles.portrait}>
      <Panel tone="red" alt bare className={styles.frame}>
        <div className={cx(styles.shot, missing && styles.shotMissing)}>
          {!missing && (
            <img
              className={styles.photo}
              src={photo.src}
              alt={photo.alt}
              width={400}
              height={400}
              loading="eager"
              decoding="async"
              onError={onError}
            />
          )}
        </div>
        <span className={styles.stamp} aria-hidden="true">
          No. 001
        </span>
        {/* Decorative while the photo shows; informative (so not hidden) while it is missing. */}
        <span className={styles.wanted} aria-hidden={missing ? undefined : true}>
          <span>{tabText}</span>
        </span>
      </Panel>
    </div>
  );
};
