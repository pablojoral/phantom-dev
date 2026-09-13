import { cx } from '../../utils/cx.ts';
import { RansomText } from '../RansomText/RansomText.tsx';
import { HEADLINE_LABEL, useHeroHeadline } from './useHeroHeadline.ts';
import styles from './HeroHeadline.module.css';

export interface HeroHeadlineProps {
  readonly className?: string | undefined;
}

export const HeroHeadline = ({ className }: HeroHeadlineProps) => {
  const words = useHeroHeadline();
  return (
    <div className={cx(styles.headline, className)}>
      <div className={styles.sheet}>
        <h1 className={styles.title} aria-label={HEADLINE_LABEL}>
          {words.map((word) => (
            <span key={word.key} className={styles.w} aria-hidden="true">
              <RansomText text={word.text} startIndex={word.startIndex} style="mix" />
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};
