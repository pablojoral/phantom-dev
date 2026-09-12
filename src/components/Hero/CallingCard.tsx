import { lede } from '../../content/profile.ts';
import { useSmoothScroll } from '../../hooks/useSmoothScroll.ts';
import { Panel } from '../Panel/Panel.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import type { RansomStyle } from '../RansomText/RansomText.tsx';
import { TITLE_LABEL, useCallingCard } from './useCallingCard.ts';
import styles from './Hero.module.css';

export interface CallingCardProps {
  /** Ransom face for the headline; defaults to a mix of magazines. */
  readonly style?: RansomStyle;
}

export const CallingCard = ({ style = 'mix' }: CallingCardProps) => {
  const words = useCallingCard();
  const scrollToHash = useSmoothScroll();
  return (
    <div className={styles.ccWrap}>
      <Panel tone="red" as="article" className={styles.cc}>
        <p className="label">
          <span>Calling card</span>
        </p>
        <h1 className={styles.ccTitle} aria-label={TITLE_LABEL}>
          {words.map((word) => (
            <span key={word.key} className={styles.w} aria-hidden="true">
              <RansomText text={word.text} startIndex={word.startIndex} style={style} />
            </span>
          ))}
        </h1>
        <p className={styles.lede}>{lede}</p>
        <a className={styles.start} href="#skills" onClick={scrollToHash}>
          Press start
        </a>
      </Panel>
    </div>
  );
};
