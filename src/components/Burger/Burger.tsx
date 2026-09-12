import type { RefObject } from 'react';
import { cx } from '../../utils/cx.ts';
import styles from './Burger.module.css';

export interface BurgerProps {
  readonly open: boolean;
  readonly controlsId: string;
  readonly buttonRef: RefObject<HTMLButtonElement | null>;
  readonly onToggle: () => void;
}

export const Burger = ({ open, controlsId, buttonRef, onToggle }: BurgerProps) => (
  <button
    ref={buttonRef}
    className={cx(styles.burger, open && styles.isOpen)}
    type="button"
    aria-label="Open menu"
    aria-expanded={open}
    aria-controls={controlsId}
    onClick={onToggle}
  >
    <span className={styles.bars} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  </button>
);
