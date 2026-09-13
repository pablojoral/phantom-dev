import { useMemo } from 'react';
import { toRansom } from '../RansomText/toRansom.ts';

export interface RansomWordView {
  readonly key: string;
  /** Ransom syntax, one scrap per letter. */
  readonly text: string;
  /** Letter offset across the whole phrase, so one face/cut deck is dealt across every word. */
  readonly startIndex: number;
}

export interface RansomLineView {
  readonly key: string;
  readonly words: ReadonlyArray<RansomWordView>;
}

export interface ContactWords {
  readonly titleLabel: string;
  readonly titleLines: ReadonlyArray<RansomLineView>;
  readonly heartLabel: string;
  readonly heartWords: ReadonlyArray<RansomWordView>;
}

export const CONTACT_TITLE = 'Contact';
const TITLE_LINES: ReadonlyArray<ReadonlyArray<string>> = [[CONTACT_TITLE]];
export const HEART_TITLE = 'Take your heart';
const HEART_WORDS: ReadonlyArray<string> = ['TAKE', 'YOUR', 'HEART'];

const toLines = (lines: ReadonlyArray<ReadonlyArray<string>>): ReadonlyArray<RansomLineView> => {
  let next = 0;
  return lines.map((line, lineIndex) => ({
    key: `line-${lineIndex}`,
    words: line.map((word, wordIndex) => {
      const startIndex = next;
      next += word.length;
      return { key: `${lineIndex}-${wordIndex}-${word}`, text: toRansom(word), startIndex };
    }),
  }));
};

export const useContactWords = (): ContactWords =>
  useMemo(
    () => ({
      titleLabel: CONTACT_TITLE,
      titleLines: toLines(TITLE_LINES),
      heartLabel: HEART_TITLE,
      heartWords: toLines([HEART_WORDS])[0]?.words ?? [],
    }),
    [],
  );
