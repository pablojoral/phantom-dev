import { useMemo } from 'react';
import { name } from '../../content/profile.ts';
import { toRansom } from '../RansomText/toRansom.ts';

export interface HeroNameWord {
  readonly key: string;
  /** Ransom-syntax word: every character wrapped as `[X]`. */
  readonly text: string;
  /** Letter offset within the full name, so one face/cut deck is dealt across both words. */
  readonly startIndex: number;
}

const toHeroNameWords = (fullName: string): ReadonlyArray<HeroNameWord> => {
  let next = 0;
  return fullName
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word, index) => {
      const startIndex = next;
      next += word.length;
      return { key: `${index}-${word}`, text: toRansom(word), startIndex };
    });
};

/** The profile name as ransom words, one inline group per word so lines wrap between words only. */
export const useHeroName = (): ReadonlyArray<HeroNameWord> => useMemo(() => toHeroNameWords(name), []);
