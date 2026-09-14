import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/** How long a phrase stays after its entrance has finished. */
const HOLD_MS = 3200;
/** Keep in sync with HeroHeadline.module.css: pop in (.3s + 40ms per letter, .3s), pop out (25ms per letter, .2s). */
const ENTER_DELAY_MS = 300;
const ENTER_STAGGER_MS = 40;
const ENTER_DURATION_MS = 300;
const LEAVE_STAGGER_MS = 25;
const LEAVE_DURATION_MS = 200;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const enterMs = (letters: number): number => ENTER_DELAY_MS + Math.max(0, letters - 1) * ENTER_STAGGER_MS + ENTER_DURATION_MS;
const leaveMs = (letters: number): number => Math.max(0, letters - 1) * LEAVE_STAGGER_MS + LEAVE_DURATION_MS;

export interface HeadlineRotation {
  /** Index of the phrase shown now. */
  readonly index: number;
  /** The shown phrase is popping out before the next one pops in. */
  readonly leaving: boolean;
}

const matches = (query: string): boolean => typeof window !== 'undefined' && window.matchMedia(query).matches;

/** True while any of the pause conditions hold: offscreen, tab hidden, hovered, or focus inside the hero. */
const usePaused = (sheetRef: RefObject<HTMLElement | null>): boolean => {
  const [offscreen, setOffscreen] = useState(false);
  const [tabHidden, setTabHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  const [hovered, setHovered] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (sheet === null) return;
    const hero = sheet.closest('header') ?? sheet;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(entry !== undefined && !entry.isIntersecting));
    observer.observe(sheet);
    const onVisibility = () => setTabHidden(document.hidden);
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    const onFocusChange = () => setFocusInside(hero.contains(document.activeElement));
    // On focusout the next element is not focused yet; read it after the event.
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    const onFocusOut = () => {
      focusTimer = setTimeout(onFocusChange, 0);
    };
    document.addEventListener('visibilitychange', onVisibility);
    sheet.addEventListener('pointerenter', onEnter);
    sheet.addEventListener('pointerleave', onLeave);
    hero.addEventListener('focusin', onFocusChange);
    hero.addEventListener('focusout', onFocusOut);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      sheet.removeEventListener('pointerenter', onEnter);
      sheet.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('focusin', onFocusChange);
      hero.removeEventListener('focusout', onFocusOut);
      clearTimeout(focusTimer);
    };
  }, [sheetRef]);

  return offscreen || tabHidden || hovered || focusInside;
};

/**
 * Cycles through the headline phrases: hold, pop the letters out, pop the next phrase in. A pause only
 * stops a hold from ending (an exit already running finishes and the next phrase still enters), and the
 * hold restarts in full on resume. Reduced motion: no rotation, the first phrase stays.
 */
export const useHeadlineRotation = (
  letterCounts: ReadonlyArray<number>,
  sheetRef: RefObject<HTMLElement | null>,
): HeadlineRotation => {
  const [state, setState] = useState<HeadlineRotation>({ index: 0, leaving: false });
  const [reduced, setReduced] = useState(() => matches(REDUCED_MOTION_QUERY));
  const paused = usePaused(sheetRef);
  const enteredIndex = useRef<number | null>(null);
  const count = letterCounts.length;

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Exit running: finish it and move on, even while paused.
  useEffect(() => {
    if (!state.leaving) return;
    const timer = setTimeout(
      () => setState({ index: (state.index + 1) % count, leaving: false }),
      leaveMs(letterCounts[state.index] ?? 0),
    );
    return () => clearTimeout(timer);
  }, [state, count, letterCounts]);

  // Hold: only runs while not paused; the first run for a phrase also waits for its entrance.
  useEffect(() => {
    if (state.leaving || reduced || paused || count < 2) return;
    const firstRun = enteredIndex.current !== state.index;
    enteredIndex.current = state.index;
    const delay = (firstRun ? enterMs(letterCounts[state.index] ?? 0) : 0) + HOLD_MS;
    const timer = setTimeout(() => setState({ index: state.index, leaving: true }), delay);
    return () => clearTimeout(timer);
  }, [state, reduced, paused, count, letterCounts]);

  return reduced ? { index: 0, leaving: false } : state;
};
