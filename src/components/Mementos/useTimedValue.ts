import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimedValue<T> {
  readonly value: T | null;
  /** Sets the value and (re)starts the timer that clears it. */
  readonly start: (value: T) => void;
  /** Clears the value now and cancels the timer. */
  readonly cancel: () => void;
  /** Like `cancel`, but only while the current value equals `value`. */
  readonly cancelIf: (value: T) => void;
}

/** A value that clears itself `ms` after it was last set. The timer is cleaned up on unmount. */
export const useTimedValue = <T,>(ms: number): TimedValue<T> => {
  const [value, setValue] = useState<T | null>(null);
  // Mirrors `value` for handlers that run before the next render.
  const current = useRef<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(
    (next: T) => {
      stop();
      current.current = next;
      setValue(next);
      timer.current = setTimeout(() => {
        timer.current = null;
        current.current = null;
        setValue(null);
      }, ms);
    },
    [ms, stop],
  );

  const cancel = useCallback(() => {
    stop();
    current.current = null;
    setValue(null);
  }, [stop]);

  const cancelIf = useCallback(
    (expected: T) => {
      if (current.current === expected) cancel();
    },
    [cancel],
  );

  useEffect(() => stop, [stop]);

  return { value, start, cancel, cancelIf };
};
