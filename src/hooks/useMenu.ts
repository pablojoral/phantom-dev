import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const BODY_LOCK_CLASS = 'menu-open';

export interface CloseMenuOptions {
  /** Return focus to the burger after closing. Defaults to true. */
  readonly restoreFocus?: boolean;
}

export interface MenuController {
  readonly open: boolean;
  readonly burgerRef: RefObject<HTMLButtonElement | null>;
  readonly firstLinkRef: RefObject<HTMLAnchorElement | null>;
  readonly toggle: () => void;
  readonly close: (options?: CloseMenuOptions) => void;
}

/**
 * Pause-menu state: open/close, Escape to close, body scroll lock, and focus
 * management (into the first link on open, back to the burger on close).
 */
export const useMenu = (): MenuController => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((options?: CloseMenuOptions) => {
    setOpen(false);
    if (options?.restoreFocus !== false) {
      burgerRef.current?.focus();
    }
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
    } else {
      setOpen(true);
    }
  }, [open, close]);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle(BODY_LOCK_CLASS, open);
    return () => {
      document.body.classList.remove(BODY_LOCK_CLASS);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return { open, burgerRef, firstLinkRef, toggle, close };
};
