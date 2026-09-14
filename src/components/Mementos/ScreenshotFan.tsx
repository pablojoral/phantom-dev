import type { ScreenshotTriple } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { useScreenshotFan } from './useScreenshotFan.ts';
import type { FanPosition } from './useScreenshotFan.ts';
import styles from './ScreenshotFan.module.css';

export interface ScreenshotFanProps {
  readonly screenshots: ScreenshotTriple;
  /** Project name, used for the screenshot alt text. */
  readonly name: string;
  /** Touch only: the card was tapped once, so the fan is shown (mouse fans on hover instead). */
  readonly open: boolean;
}

const POSITION_CLASS: Readonly<Record<FanPosition, string | undefined>> = {
  1: styles.shot1,
  2: styles.shot2,
  3: styles.shot3,
};

/** Three phones tucked behind a card: fanned by the card's hover on mouse, by a first tap (`open`) on touch. */
export const ScreenshotFan = ({ screenshots, name, open }: ScreenshotFanProps) => {
  const shots = useScreenshotFan(screenshots, name);
  return (
    <ul className={cx(styles.fan, open && styles.open)} aria-hidden="true">
      {shots.map((shot) => (
        <li key={shot.key} className={cx(styles.shot, POSITION_CLASS[shot.position])}>
          <img
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            style={{ aspectRatio: shot.ratio }}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
};
