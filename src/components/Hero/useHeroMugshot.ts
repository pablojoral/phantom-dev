import { toRansom } from '../RansomText/toRansom.ts';
import { useHeroPhoto } from './useHeroPhoto.ts';
import type { HeroPhotoState } from './useHeroPhoto.ts';

export interface HeroMugshotState extends HeroPhotoState {
  /** The corner label in ransom syntax. */
  readonly label: string;
}

const LABEL = toRansom('WANTED');

export const useHeroMugshot = (): HeroMugshotState => ({ ...useHeroPhoto(), label: LABEL });
