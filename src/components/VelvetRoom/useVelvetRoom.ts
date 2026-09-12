import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { experience } from '../../content/profile.ts';
import type { Experience, PanelTone } from '../../content/profile.ts';

export interface ContractOutcome {
  readonly key: string;
  readonly text: string;
  readonly style: CSSProperties;
}

export interface ContractEntry extends Experience {
  readonly key: string;
  readonly label: string;
  readonly tone: PanelTone;
  readonly tilt: 'l' | 'r';
  readonly alt: boolean;
  readonly outcomes: ReadonlyArray<ContractOutcome>;
}

const outcomeStyle = (index: number): CSSProperties =>
  // `--b` staggers each bullet's scroll range in CSS; CSSProperties has no slot for custom properties.
  ({ '--b': index }) as CSSProperties;

/** Entries alternate paper/right-tilt and red/left-tilt/torn-b, top to bottom. */
const toEntry = (item: Experience, index: number): ContractEntry => {
  const red = index % 2 === 1;
  return {
    ...item,
    key: item.contract,
    label: `Contract No. ${item.contract} · ${item.years}`,
    tone: red ? 'red' : 'paper',
    tilt: red ? 'l' : 'r',
    alt: red,
    outcomes: item.bullets.map((text, i) => ({ key: text, text, style: outcomeStyle(i) })),
  };
};

export const useVelvetRoom = (): ReadonlyArray<ContractEntry> => useMemo(() => experience.map(toEntry), []);
