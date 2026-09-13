import { useCallback, useState } from 'react';

export interface HeroPhotoState {
  /** True once the image failed to load (typically: `public/profile.jpg` not added yet). */
  readonly missing: boolean;
  readonly onError: () => void;
}

export const MISSING_TEXT = 'Drop profile.jpg in /public';

export const useHeroPhoto = (): HeroPhotoState => {
  const [missing, setMissing] = useState(false);
  const onError = useCallback(() => setMissing(true), []);
  return { missing, onError };
};
