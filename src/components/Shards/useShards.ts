import { useId } from 'react';
import { SHARDS } from './shards.ts';
import type { Shard } from './shards.ts';

export interface ShardsState {
  readonly patternId: string;
  /** `fill` value referencing the halftone pattern. */
  readonly textureFill: string;
  readonly shards: ReadonlyArray<Shard>;
}

export const useShards = (): ShardsState => {
  // useId can contain characters that are awkward inside `url(#…)`; keep the id plain.
  const patternId = `shards-halftone-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return { patternId, textureFill: `url(#${patternId})`, shards: SHARDS };
};
