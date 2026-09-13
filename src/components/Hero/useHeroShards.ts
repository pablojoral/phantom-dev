import { useId } from 'react';
import { HERO_SHARDS } from './heroShards.ts';
import type { Shard } from './heroShards.ts';

export interface HeroShardsState {
  readonly patternId: string;
  /** `fill` value referencing the halftone pattern. */
  readonly textureFill: string;
  readonly shards: ReadonlyArray<Shard>;
}

export const useHeroShards = (): HeroShardsState => {
  // useId can contain characters that are awkward inside `url(#…)`; keep the id plain.
  const patternId = `hero-halftone-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return { patternId, textureFill: `url(#${patternId})`, shards: HERO_SHARDS };
};
