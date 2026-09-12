import { useCallback, useState } from 'react';

export interface PortraitState {
  /** True once the image failed to load (typically: `public/profile.jpg` not added yet). */
  readonly missing: boolean;
  readonly onError: () => void;
  /** Copy on the paper tab: the wanted line, or the instruction while the file is missing. */
  readonly tabText: string;
}

export const WANTED_TEXT = 'Wanted · Phantom Dev';
export const MISSING_TEXT = 'Drop profile.jpg in /public';

export const usePortrait = (): PortraitState => {
  const [missing, setMissing] = useState(false);
  const onError = useCallback(() => setMissing(true), []);
  return { missing, onError, tabText: missing ? MISSING_TEXT : WANTED_TEXT };
};
