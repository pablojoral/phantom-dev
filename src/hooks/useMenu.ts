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
 * Keeps Tab inside the open menu: the burger (its only close control) and the
 * menu links form one loop, so focus never reaches the page behind the overlay.
 */
const cycleFocus = (event: KeyboardEvent, burger: HTMLButtonElement | null, firstLink: HTMLAnchorElement | null) => {
  const links = firstLink?.closest('nav')?.querySelectorAll<HTMLAnchorElement>('a[href]');
  if (burger === null || links === undefined) {
    return;
  }
  const loop: ReadonlyArray<HTMLElement> = [burger, ...links];
  const current = loop.indexOf(document.activeElement as HTMLElement);
  const step = event.shiftKey ? -1 : 1;
  const next = loop[current === -1 ? 0 : (current + step + loop.length) % loop.length];
  event.preventDefault();
  next?.focus();
};

/**
 * Pause-menu state: open/close, Escape to close, body scroll lock, and focus
 * management (into the first link on open, Tab looped through burger + links,
 * back to the burger on close).
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
      } else if (event.key === 'Tab') {
        cycleFocus(event, burgerRef.current, firstLinkRef.current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return { open, burgerRef, firstLinkRef, toggle, close };
};
