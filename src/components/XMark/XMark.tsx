import { cx } from '../../utils/cx.ts';
import styles from './XMark.module.css';

export interface XMarkProps {
  readonly className?: string | undefined;
}

/** Two crossing, tapered brush strokes. One path, so the paper rim outlines the union, not the crossing. */
export const XMark = ({ className }: XMarkProps) => (
  <svg className={cx(styles.mark, className)} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <path
      className={styles.stroke}
      d="M22 34 L44 18 L108 82 L184 150 L176 176 L154 184 L92 122 Z M170 22 L190 42 L124 104 L46 184 L20 176 L14 156 L90 90 Z"
    />
  </svg>
);
