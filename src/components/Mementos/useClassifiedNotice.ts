import { useCallback, useEffect, useRef, useState } from 'react';
import { confidentialNotice } from '../../content/profile.ts';

/** How long the notice stays up, and how long its exit fade takes. */
const SHOW_MS = 2400;
const LEAVE_MS = 200;
/** Page movement below this counts as tap jitter, not a scroll. */
const SCROLL_TOLERANCE_PX = 8;
/** A beat between clearing and refilling the live region, so every activation is announced. */
const ANNOUNCE_DELAY_MS = 50;
const ANNOUNCEMENT = `${confidentialNotice.stamp}. ${confidentialNotice.message}`;

export interface ClassifiedNotice {
  /** `target` of the card showing it. */
  readonly target: string;
  /** Grows on every activation; used as a React key so the shake and the slam restart. */
  readonly key: number;
  /** Fading out before it unmounts. */
  readonly leaving: boolean;
}

export interface ClassifiedNoticeController {
  readonly notice: ClassifiedNotice | null;
  /** Text for the shared polite live region. */
  readonly announcement: string;
  readonly show: (target: string) => void;
  readonly hide: () => void;
}

/** One notice at a time: auto-hides, and closes early on Escape or a scroll of more than a few pixels. */
export const useClassifiedNotice = (): ClassifiedNoticeController => {
  const [notice, setNotice] = useState<ClassifiedNotice | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const counter = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const later = useCallback((run: () => void, ms: number) => {
    timers.current.push(setTimeout(run, ms));
  }, []);

  const hide = useCallback(() => {
    clearTimers();
    setAnnouncement('');
    setNotice((current) => (current === null || current.leaving ? current : { ...current, leaving: true }));
    later(() => setNotice(null), LEAVE_MS);
  }, [clearTimers, later]);

  const show = useCallback(
    (target: string) => {
      clearTimers();
      counter.current += 1;
      setNotice({ target, key: counter.current, leaving: false });
      setAnnouncement('');
      later(() => setAnnouncement(ANNOUNCEMENT), ANNOUNCE_DELAY_MS);
      later(hide, SHOW_MS);
    },
    [clearTimers, later, hide],
  );

  const visibleKey = notice !== null && !notice.leaving ? notice.key : null;
  useEffect(() => {
    if (visibleKey === null) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > SCROLL_TOLERANCE_PX) hide();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [visibleKey, hide]);

  useEffect(() => clearTimers, [clearTimers]);

  return { notice, announcement, show, hide };
};
