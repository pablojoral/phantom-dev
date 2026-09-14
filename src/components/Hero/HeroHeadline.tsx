import { cx } from '../../utils/cx.ts';
import { PaperSheet } from '../PaperSheet/PaperSheet.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import { useHeroHeadline } from './useHeroHeadline.ts';
import styles from './HeroHeadline.module.css';

export interface HeroHeadlineProps {
  readonly className?: string | undefined;
}

export const HeroHeadline = ({ className }: HeroHeadlineProps) => {
  const { label, words } = useHeroHeadline();
  return (
    <PaperSheet className={cx(styles.headline, className)}>
      <h1 className={styles.title} aria-label={label}>
        {words.map((word) => (
          <span key={word.key} className={styles.w} aria-hidden="true">
            <RansomText text={word.text} startIndex={word.startIndex} style="mix" />
          </span>
        ))}
      </h1>
    </PaperSheet>
  );
};
