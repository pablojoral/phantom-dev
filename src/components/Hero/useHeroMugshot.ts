import { mugshotLabel } from '../../content/profile.ts';
import { toRansom } from '../RansomText/toRansom.ts';
import { useHeroPhoto } from './useHeroPhoto.ts';
import type { HeroPhotoState } from './useHeroPhoto.ts';

export interface HeroMugshotState extends HeroPhotoState {
  /** The corner label in ransom syntax; empty when there is no label. */
  readonly label: string;
}

const LABEL = mugshotLabel.trim() === '' ? '' : toRansom(mugshotLabel.trim());

export const useHeroMugshot = (): HeroMugshotState => ({ ...useHeroPhoto(), label: LABEL });
