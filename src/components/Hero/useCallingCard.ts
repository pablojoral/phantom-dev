import { useMemo } from 'react';

interface TitleWord {
  readonly text: string;
  readonly hot: boolean;
}

export interface RansomWord {
  readonly key: string;
  /** Ransom-syntax string for `RansomText`. */
  readonly text: string;
  /** First `--i` for this word, so the stagger runs across the whole title. */
  readonly startIndex: number;
}

export const TITLE_LABEL = 'Take your app';

const TITLE_WORDS: ReadonlyArray<TitleWord> = [
  { text: 'TAKE', hot: false },
  { text: 'YOUR', hot: false },
  { text: 'APP', hot: false },
];

const toRansomWords = (words: ReadonlyArray<TitleWord>): ReadonlyArray<RansomWord> => {
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

export const useCallingCard = (): ReadonlyArray<RansomWord> => useMemo(() => toRansomWords(TITLE_WORDS), []);
