import type { ScreenshotTriple } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { useScreenshotFan } from './useScreenshotFan.ts';
import type { FanPosition } from './useScreenshotFan.ts';
import styles from './ScreenshotFan.module.css';

export interface ScreenshotFanProps {
  readonly screenshots: ScreenshotTriple;
  /** Project name, used for the screenshot alt text. */
  readonly name: string;
  /** No card below in one column: on touch the fan folds on its own card's timeline. */
  readonly lastInOneColumn: boolean;
  /** No card below in two columns. */
  readonly lastInTwoColumns: boolean;
}

const POSITION_CLASS: Readonly<Record<FanPosition, string | undefined>> = {
  1: styles.shot1,
  2: styles.shot2,
  3: styles.shot3,
};

/** Three phones tucked behind a card: fanned by the card's hover on mouse, by scroll position on touch (CSS only). */
export const ScreenshotFan = ({ screenshots, name, lastInOneColumn, lastInTwoColumns }: ScreenshotFanProps) => {
  const shots = useScreenshotFan(screenshots, name);
  return (
    <ul
      className={cx(styles.fan, lastInOneColumn && styles.lastInOneColumn, lastInTwoColumns && styles.lastInTwoColumns)}
      aria-hidden="true"
    >
      {shots.map((shot) => (
        <li key={shot.key} className={cx(styles.shot, POSITION_CLASS[shot.position])}>
          <img src={shot.src} alt={shot.alt} width={390} height={844} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
};
