import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.ts';
import styles from './OutlinedRansom.module.css';

export interface OutlinedRansomProps {
  readonly as?: 'p' | 'h2';
  readonly id?: string | undefined;
  /** Accessible text; the papercut children should be aria-hidden word groups. */
  readonly label: string;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/** Papercut word groups with an ink rim inside a red rim (the hero name treatment). */
export const OutlinedRansom = ({ as: Tag = 'p', id, label, className, children }: OutlinedRansomProps) => (
  <Tag id={id} className={cx(className, styles.outlined)} aria-label={label}>
    {children}
  </Tag>
);
