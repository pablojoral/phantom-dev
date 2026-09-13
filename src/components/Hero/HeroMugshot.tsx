import { photo } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { RansomText } from '../RansomText/RansomText.tsx';
import { XMark } from '../XMark/XMark.tsx';
import { useHeroMugshot } from './useHeroMugshot.ts';
import styles from './HeroMugshot.module.css';

export interface HeroMugshotProps {
  readonly className?: string | undefined;
}

/** Decorative close-up: the figure already carries the photo's alt text. */
export const HeroMugshot = ({ className }: HeroMugshotProps) => {
  const { missing, onError, label } = useHeroMugshot();
  return (
    <div className={cx(styles.mugshot, className)} aria-hidden="true">
      <div className={styles.frame}>
        <div className={styles.crop}>
          {!missing && (
            <img
              className={styles.photo}
              src={photo.src}
              alt=""
              width={400}
              height={400}
              loading="eager"
              decoding="async"
              onError={onError}
            />
          )}
        </div>
      </div>
      <span className={styles.label}>
        <RansomText text={label} style="mix" />
      </span>
      <XMark className={styles.mark} />
    </div>
  );
};
