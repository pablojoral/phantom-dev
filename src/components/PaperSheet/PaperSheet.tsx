import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.ts';
import styles from './PaperSheet.module.css';

export interface PaperSheetProps {
  /** Tilt the other way (+5deg). */
  readonly mirror?: boolean;
  /** Placement on the outer, tilted layer. */
  readonly className?: string | undefined;
  /** Layout of the content inside the torn sheet. */
  readonly sheetClassName?: string | undefined;
  readonly children: ReactNode;
}

export const PaperSheet = ({ mirror = false, className, sheetClassName, children }: PaperSheetProps) => (
  <div className={cx(styles.paper, mirror && styles.mirror, className)}>
    <div className={cx(styles.sheet, sheetClassName)}>{children}</div>
  </div>
);
