import { useMemo } from 'react';

interface HeadlineWord {
  readonly text: string;
  readonly hot: boolean;
}

export interface RansomWord {
  readonly key: string;
  /** Ransom-syntax string for `RansomText`. */
  readonly text: string;
  /** First `--i` for this word, so the stagger runs across the whole headline. */
  readonly startIndex: number;
}

export const HEADLINE_LABEL = 'Take your app';

const HEADLINE_WORDS: ReadonlyArray<HeadlineWord> = [
  { text: 'TAKE', hot: false },
  { text: 'YOUR', hot: false },
  { text: 'APP', hot: false },
];

const toRansomWords = (words: ReadonlyArray<HeadlineWord>): ReadonlyArray<RansomWord> => {
  let next = 0;
  return words.map((word) => {
    const startIndex = next;
    next += word.text.length;
    return {
      key: word.text,
      text: word.hot ? `{${word.text}}` : `[${word.text}]`,
      startIndex,
    };
  });
};

export const useHeroHeadline = (): ReadonlyArray<RansomWord> => useMemo(() => toRansomWords(HEADLINE_WORDS), []);
