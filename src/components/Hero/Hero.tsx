import { cx } from '../../utils/cx.ts';
import { HeroDossier } from './HeroDossier.tsx';
import { HeroFigure } from './HeroFigure.tsx';
import { HeroHeadline } from './HeroHeadline.tsx';
import { HeroMugshot } from './HeroMugshot.tsx';
import { HeroShards } from './HeroShards.tsx';
import { HeroTitle } from './HeroTitle.tsx';
import styles from './Hero.module.css';

/** DOM order is reading order; the grid in Hero.module.css places and layers the pieces. */
export const Hero = () => (
  <header className={styles.hero} id="top">
    <HeroShards className={styles.shards} />
    <div className={cx('wrap', styles.stage)}>
      <HeroTitle className={styles.title} />
      <HeroHeadline className={styles.headline} />
      <HeroDossier className={styles.dossier} />
      <HeroFigure frameClassName={styles.figureFrame} className={styles.figure} />
      <HeroMugshot className={styles.mugshot} />
    </div>
  </header>
);
