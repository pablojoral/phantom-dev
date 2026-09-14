import { useMemo } from 'react';
import { heroHeadline } from '../../content/profile.ts';
import { ransomLetterCount, toRansom } from '../RansomText/toRansom.ts';

export interface RansomWord {
  readonly key: string;
  /** Ransom-syntax string for `RansomText`. */
  readonly text: string;
  /** First `--i` for this word, so the stagger runs across the whole headline. */
  readonly startIndex: number;
}

export interface HeroHeadlineView {
  /** Accessible name, e.g. "Ship your app". */
  readonly label: string;
  readonly words: ReadonlyArray<RansomWord>;
}

const toRansomWords = (phrase: string): ReadonlyArray<RansomWord> => {
  let next = 0;
  return phrase
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word, index) => {
      const startIndex = next;
      next += ransomLetterCount(word);
      return { key: `${index}-${word}`, text: toRansom(word), startIndex };
    });
};

export const useHeroHeadline = (): HeroHeadlineView =>
  useMemo(() => ({ label: heroHeadline, words: toRansomWords(heroHeadline) }), []);
