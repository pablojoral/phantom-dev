import { cx } from '../../utils/cx.ts';
import { PaperSheet } from '../PaperSheet/PaperSheet.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import { useHeroHeadline } from './useHeroHeadline.ts';
import styles from './HeroHeadline.module.css';

export interface HeroHeadlineProps {
  readonly className?: string | undefined;
}

/** Rotating papercut headline. Every phrase is stacked in one cell, so the sheet never changes size. */
export const HeroHeadline = ({ className }: HeroHeadlineProps) => {
  const { label, phrases, sheetRef } = useHeroHeadline();
  return (
    <PaperSheet ref={sheetRef} className={cx(styles.headline, className)}>
      <h1 className={styles.title} aria-label={label}>
        {phrases.map((phrase) => (
          <span
            key={phrase.key}
            className={cx(styles.phrase, phrase.active && styles.active, phrase.leaving && styles.leaving)}
            style={phrase.style}
            aria-hidden="true"
          >
            {phrase.words.map((word) => (
              <span key={word.key} className={styles.w}>
                <RansomText text={word.text} startIndex={word.startIndex} style="mix" />
              </span>
            ))}
          </span>
        ))}
      </h1>
    </PaperSheet>
  );
};
