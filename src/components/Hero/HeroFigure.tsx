import { photo } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { MISSING_TEXT, useHeroPhoto } from './useHeroPhoto.ts';
import styles from './HeroFigure.module.css';

export interface HeroFigureProps {
  /** Placement for the paper outline shard, a separate layer so it can sit under the dossier. */
  readonly frameClassName?: string | undefined;
  readonly className?: string | undefined;
}

export const HeroFigure = ({ frameClassName, className }: HeroFigureProps) => {
  const { missing, onError } = useHeroPhoto();
  return (
    <>
      <div className={cx(styles.frame, frameClassName)} aria-hidden="true" />
      <div className={cx(styles.figure, className)}>
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
          {missing && (
            <span className={styles.missing}>
              <span>{MISSING_TEXT}</span>
            </span>
          )}
        </div>
      </div>
    </>
  );
};
