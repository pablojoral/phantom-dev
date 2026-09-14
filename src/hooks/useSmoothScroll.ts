import { useCallback } from 'react';
import type { MouseEvent } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export type HashLinkHandler = (event: MouseEvent<HTMLAnchorElement>) => void;

/**
 * Click handler for in-page `#section` links: smooth-scrolls (unless the user
 * prefers reduced motion), moves focus to the target, and updates the URL.
 * Falls through to default navigation when the href is bare `#` or the
 * target does not exist.
 */
export const useSmoothScroll = (): HashLinkHandler =>
  useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href');
    if (href === null || href.length < 2) {
      return;
    }
    const target = document.getElementById(href.slice(1));
    if (target === null) {
      return;
    }
    event.preventDefault();
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
    window.history.pushState(null, '', href);
  }, []);
