import type { ScreenshotTriple } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { useScreenshotFan } from './useScreenshotFan.ts';
import type { FanPosition } from './useScreenshotFan.ts';
import styles from './ScreenshotFan.module.css';

export interface ScreenshotFanProps {
  readonly screenshots: ScreenshotTriple;
  /** Project name, used for the screenshot alt text. */
  readonly name: string;
}

const POSITION_CLASS: Readonly<Record<FanPosition, string | undefined>> = {
  1: styles.shot1,
  2: styles.shot2,
  3: styles.shot3,
};

/** Three phones tucked behind a card; the parent's :hover fans them out (CSS only, never on focus). */
export const ScreenshotFan = ({ screenshots, name }: ScreenshotFanProps) => {
  const shots = useScreenshotFan(screenshots, name);
  return (
    <ul className={styles.fan} aria-hidden="true">
      {shots.map((shot) => (
        <li key={shot.key} className={cx(styles.shot, POSITION_CLASS[shot.position])}>
          <img src={shot.src} alt={shot.alt} width={390} height={844} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
};
