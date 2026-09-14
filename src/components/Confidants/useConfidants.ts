import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { skills } from '../../content/profile.ts';
import type { Skill, SkillTier } from '../../content/profile.ts';
import { hashString } from '../RansomText/ransomVariation.ts';

export interface SkillPieceView {
  readonly key: string;
  readonly kind: SkillTier;
  readonly name: string;
  readonly detail: string | undefined;
  readonly style: CSSProperties;
}

/** Tilt range per kind of piece, in degrees. */
const TILT_RANGE: Readonly<Record<SkillTier, number>> = { signature: 2.5, core: 2.5, support: 3 };

/** A value in [−range, +range] from a hash, rounded to 2 decimals. */
const spread = (hash: number, range: number, steps: number): number =>
  Math.round(((hash % (steps + 1)) / steps - 0.5) * 2 * range * 100) / 100;

const toPiece = (skill: Skill, index: number): SkillPieceView => {
  const hash = hashString(skill.name);
  const tilt = spread(hash, TILT_RANGE[skill.tier], 400);
  const dy = spread(hash >>> 11, 6, 12);
  return {
    key: skill.name,
    kind: skill.tier,
    name: skill.name,
    detail: skill.detail,
    // Custom properties drive tilt, offset and stagger in CSS; CSSProperties has no slot for them.
    style: { '--tilt': `${tilt}deg`, '--dy': `${dy}px`, '--i': index } as CSSProperties,
  };
};

/** Profile order is kept (signature → core → support), so the strongest skills come first for screen readers. */
export const useConfidants = (): ReadonlyArray<SkillPieceView> => useMemo(() => skills.map(toPiece), []);
