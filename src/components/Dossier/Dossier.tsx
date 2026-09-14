import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.ts';
import styles from './Dossier.module.css';

export interface DossierProps {
  /** Skew the other way (+3deg). */
  readonly mirror?: boolean;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/**
 * Ink panel with a paper border, skewed, content counter-skewed. Its bottom padding grows by
 * `--overlap` (inherited from the layout) so an overlapping sheet can only land on empty padding.
 */
export const Dossier = ({ mirror = false, className, children }: DossierProps) => (
  <div className={cx(styles.panel, mirror && styles.mirror, className)}>
    <div className={styles.inner}>{children}</div>
  </div>
);
