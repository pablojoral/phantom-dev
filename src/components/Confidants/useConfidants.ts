import { useMemo } from 'react';
import { skills } from '../../content/profile.ts';
import type { Rank } from '../../content/profile.ts';

export const MAX_RANK: Rank = 10;

export interface RankRow {
  readonly key: string;
  readonly arcana: string;
  readonly name: string;
  readonly rank: Rank;
  readonly meterLabel: string;
  readonly rankLabel: string;
  /** One flag per meter segment, in order. */
  readonly segments: ReadonlyArray<boolean>;
}

const toRow = (skill: (typeof skills)[number]): RankRow => ({
  key: skill.name,
  arcana: skill.arcana,
  name: skill.name,
  rank: skill.rank,
  meterLabel: `Rank ${skill.rank} of ${MAX_RANK}`,
  rankLabel: `Rank ${skill.rank}/${MAX_RANK}`,
  segments: Array.from({ length: MAX_RANK }, (_, i) => i < skill.rank),
});

export const useConfidants = (): ReadonlyArray<RankRow> => useMemo(() => skills.map(toRow), []);
