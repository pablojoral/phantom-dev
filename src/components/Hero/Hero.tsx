import { name, tagline } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { RansomText } from '../RansomText/RansomText.tsx';
import { CallingCard } from './CallingCard.tsx';
import { Portrait } from './Portrait.tsx';
import { useHeroName } from './useHeroName.ts';
import styles from './Hero.module.css';

export const Hero = () => {
  const words = useHeroName();
  return (
    <header className={cx(styles.hero, 'wrap')} id="top">
      <div className={styles.nameBlock}>
        <p className={styles.name} aria-label={name}>
          {words.map((word) => (
            <span key={word.key} className={styles.w} aria-hidden="true">
              <RansomText text={word.text} startIndex={word.startIndex} salt={name} style="mix" leadTone="ink" />
            </span>
          ))}
        </p>
        <p className={styles.nameTag}>{tagline}</p>
      </div>

      <div className={styles.grid}>
        <CallingCard />
        <Portrait />
      </div>
    </header>
  );
};
