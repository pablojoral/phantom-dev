import { name, tagline } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { OutlinedRansom } from '../OutlinedRansom/OutlinedRansom.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import { useHeroName } from './useHeroName.ts';
import styles from './HeroTitle.module.css';

export interface HeroTitleProps {
  readonly className?: string | undefined;
}

export const HeroTitle = ({ className }: HeroTitleProps) => {
  const words = useHeroName();
  return (
    <div className={cx(styles.title, className)}>
      <p className={styles.tag}>
        <span>{tagline}</span>
      </p>
      <OutlinedRansom className={styles.name} label={name}>
        {words.map((word) => (
          <span key={word.key} className={styles.w} aria-hidden="true">
            <RansomText text={word.text} startIndex={word.startIndex} salt={name} style="mix" leadTone="ink" />
          </span>
        ))}
      </OutlinedRansom>
    </div>
  );
};
