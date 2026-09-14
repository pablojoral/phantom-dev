import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Touch layouts: no real hover, or a coarse pointer. Read at event time, since hybrids can switch. */
export const TOUCH_QUERY = '(hover: none), (pointer: coarse)';

/** Page movement below this counts as tap jitter, not a scroll. */
const SCROLL_TOLERANCE_PX = 8;

/**
 * While a touch fan is open, closes it on a press outside its card, a scroll of more than a few
 * pixels, Escape, or a switch to a hover-capable layout. Listeners exist only while a fan is open.
 */
export const useFanDismiss = (
  openFan: string | null,
  cardRef: RefObject<HTMLElement | null>,
  close: () => void,
): void => {
  useEffect(() => {
    if (openFan === null) return;
    const startY = window.scrollY;
    const media = window.matchMedia(TOUCH_QUERY);

    const onPointerDown = (event: PointerEvent) => {
      const card = cardRef.current;
      if (card === null || !(event.target instanceof Node) || !card.contains(event.target)) close();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > SCROLL_TOLERANCE_PX) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const onMediaChange = () => {
      if (!media.matches) close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', onMediaChange);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', onMediaChange);
    };
  }, [openFan, cardRef, close]);
};
