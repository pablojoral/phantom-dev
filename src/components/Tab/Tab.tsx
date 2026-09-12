import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.ts';

export type TabProps =
  | {
      readonly kind: 'heading';
      readonly id: string;
      /** Plain-text name when `children` is decorated markup screen readers should skip. */
      readonly label?: string;
      readonly children: ReactNode;
    }
  | { readonly kind: 'link'; readonly href: string; readonly ink?: boolean; readonly children: ReactNode };

export const Tab = (props: TabProps) =>
  props.kind === 'heading' ? (
    <h2 id={props.id} className="tab" aria-label={props.label}>
      <span aria-hidden={props.label === undefined ? undefined : true}>{props.children}</span>
    </h2>
  ) : (
    <a className={cx('tab', props.ink === true && 'tab--ink')} href={props.href}>
      <span>{props.children}</span>
    </a>
  );
