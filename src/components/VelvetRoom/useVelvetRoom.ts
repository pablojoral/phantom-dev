import { useMemo } from 'react';
import { experience } from '../../content/profile.ts';
import type { Experience, PanelTone } from '../../content/profile.ts';

export interface ContractEntry extends Experience {
  readonly key: string;
  readonly label: string;
  readonly tone: PanelTone;
  readonly tilt: 'l' | 'r';
  readonly alt: boolean;
}

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
  };
};

export const useVelvetRoom = (): ReadonlyArray<ContractEntry> => useMemo(() => experience.map(toEntry), []);
