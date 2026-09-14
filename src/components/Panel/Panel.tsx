import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.ts';

export interface PanelProps {
  readonly tone: 'paper' | 'red' | 'ink';
  /** Use the second torn-edge polygon (`--tear-b`). */
  readonly alt?: boolean;
  readonly tilt?: 'l' | 'r';
  readonly as?: 'div' | 'article';
  /** Skip the skewed `.panel__in` wrapper and render children directly. */
  readonly bare?: boolean;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

export const Panel = ({ tone, alt = false, tilt, as: Tag = 'div', bare = false, className, children }: PanelProps) => (
  <Tag className={cx('panel', `panel--${tone}`, tilt !== undefined && `tilt-${tilt}`, alt && 'alt', className)}>
    {bare ? children : <div className="panel__in">{children}</div>}
  </Tag>
);
