import { useMemo, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { heroHeadlines } from '../../content/profile.ts';
import { ransomLetterCount, toRansom } from '../RansomText/toRansom.ts';
import { useHeadlineRotation } from './useHeadlineRotation.ts';

export interface RansomWord {
  readonly key: string;
  /** Ransom-syntax string for `RansomText`. */
  readonly text: string;
  /** First `--i` for this word, so the stagger runs across the whole phrase. */
  readonly startIndex: number;
}

export interface HeadlinePhrase {
  readonly key: string;
  readonly words: ReadonlyArray<RansomWord>;
  /** `--n`: letter count, for the reverse pop-out stagger. */
  readonly style: CSSProperties;
  readonly active: boolean;
  readonly leaving: boolean;
}

export interface HeroHeadlineView {
  /** Stable accessible name: the first phrase ("Ship your app"). */
  readonly label: string;
  readonly phrases: ReadonlyArray<HeadlinePhrase>;
  readonly sheetRef: RefObject<HTMLDivElement | null>;
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

const PHRASES = heroHeadlines.map((text) => ({
  key: text,
  words: toRansomWords(text),
  letters: ransomLetterCount(text),
}));
const LETTER_COUNTS: ReadonlyArray<number> = PHRASES.map((phrase) => phrase.letters);

export const useHeroHeadline = (): HeroHeadlineView => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { index, leaving } = useHeadlineRotation(LETTER_COUNTS, sheetRef);
  const phrases = useMemo(
    () =>
      PHRASES.map(
        (phrase, i): HeadlinePhrase => ({
          key: phrase.key,
          words: phrase.words,
          // Custom property: CSSProperties has no slot for it.
          style: { '--n': phrase.letters } as CSSProperties,
          active: i === index,
          leaving: i === index && leaving,
        }),
      ),
    [index, leaving],
  );
  return { label: heroHeadlines[0], phrases, sheetRef };
};
