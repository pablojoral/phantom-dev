import type { RefObject } from 'react';
import { cx } from '../../utils/cx.ts';
import styles from './DossierField.module.css';

export type DossierTab =
  | { readonly kind: 'label'; readonly text: string }
  | { readonly kind: 'button'; readonly text: string; readonly onClick: () => void; readonly describedBy?: string | undefined };

export interface DossierFieldProps {
  readonly label: string;
  readonly value: string;
  /** Small tab hanging off the bar's left edge: decorative text or a button. */
  readonly tab?: DossierTab | undefined;
  /** When set, the bar is a link. */
  readonly href?: string | undefined;
  /** Keep the value's case (addresses, URLs) and let it wrap anywhere. */
  readonly plain?: boolean;
  readonly valueId?: string | undefined;
  readonly valueRef?: RefObject<HTMLSpanElement | null> | undefined;
}

/** One `dt` / `dd` pair for a `<dl>` inside a Dossier: lowercase label over a red skewed bar. */
export const DossierField = ({ label, value, tab, href, plain = false, valueId, valueRef }: DossierFieldProps) => (
  <div className={styles.field}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>
      {tab?.kind === 'label' && (
        <span className={styles.tab} aria-hidden="true">
          <span>{tab.text}</span>
        </span>
      )}
      {tab?.kind === 'button' && (
        <button type="button" className={cx(styles.tab, styles.tabButton)} aria-describedby={tab.describedBy} onClick={tab.onClick}>
          <span>{tab.text}</span>
        </button>
      )}
      {href === undefined ? (
        <span className={cx(styles.bar, plain && styles.plain)}>
          <span id={valueId} ref={valueRef}>
            {value}
          </span>
        </span>
      ) : (
        <a className={cx(styles.bar, styles.link, plain && styles.plain)} href={href}>
          <span id={valueId} ref={valueRef}>
            {value}
          </span>
        </a>
      )}
    </dd>
  </div>
);
