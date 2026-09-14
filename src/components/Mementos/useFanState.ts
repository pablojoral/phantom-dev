import { useCallback, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import { useTimedValue } from './useTimedValue.ts';

/**
 * How long a closing fan keeps its raised, promoted state. Keep in sync with the close transition in
 * ScreenshotFan.module.css: 120ms stagger + max(.38s fold, .24s + .16s fade) ≈ 500ms, plus a margin.
 */
export const FAN_CLOSE_MS = 600;

export interface FanState {
  /** Touch: the card whose fan is shown. */
  readonly openFan: string | null;
  /** Touch: the card whose fan is folding back; it stays raised and promoted until the fold ends. */
  readonly closingFan: string | null;
  /** Mouse: the card the pointer just left; keeps it raised while its hover fan folds. */
  readonly hoverClosing: string | null;
  /** Mirrors `openFan` for event handlers, so a dismissal and the next tap never read a stale value. */
  readonly openFanRef: RefObject<string | null>;
  readonly fanCardRef: RefObject<HTMLElement | null>;
  readonly openCardFan: (card: HTMLElement) => void;
  readonly closeFan: () => void;
  readonly onCardPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  readonly onCardPointerLeave: (event: PointerEvent<HTMLElement>) => void;
}

/** Open / closing state for the screenshot fans, as explicit classes rather than delayed CSS transitions. */
export const useFanState = (): FanState => {
  const [openFan, setOpenFan] = useState<string | null>(null);
  const openFanRef = useRef<string | null>(null);
  const fanCardRef = useRef<HTMLElement | null>(null);
  const closing = useTimedValue<string>(FAN_CLOSE_MS);
  const hoverClosing = useTimedValue<string>(FAN_CLOSE_MS);
  const { start: startClosing, cancelIf: cancelClosingIf } = closing;

  const setOpen = useCallback((card: HTMLElement | null) => {
    const target = card?.dataset['target'] ?? null;
    openFanRef.current = target;
    fanCardRef.current = card;
    setOpenFan(target);
  }, []);

  const closeFan = useCallback(() => {
    const current = openFanRef.current;
    if (current === null) return;
    startClosing(current);
    setOpen(null);
  }, [setOpen, startClosing]);

  const openCardFan = useCallback(
    (card: HTMLElement) => {
      const target = card.dataset['target'];
      const current = openFanRef.current;
      if (current !== null && current !== target) startClosing(current);
      // Re-opening the card that is still folding back: stop its fold here. Another card keeps folding.
      if (target !== undefined) cancelClosingIf(target);
      setOpen(card);
    },
    [setOpen, startClosing, cancelClosingIf],
  );

  const { start: startHoverClosing, cancel: cancelHoverClosing } = hoverClosing;
  const onCardPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const target = event.currentTarget.dataset['target'];
      if (event.pointerType === 'mouse' && target !== undefined) startHoverClosing(target);
    },
    [startHoverClosing],
  );
  const onCardPointerEnter = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') cancelHoverClosing();
    },
    [cancelHoverClosing],
  );

  return {
    openFan,
    closingFan: closing.value,
    hoverClosing: hoverClosing.value,
    openFanRef,
    fanCardRef,
    openCardFan,
    closeFan,
    onCardPointerEnter,
    onCardPointerLeave,
  };
};
