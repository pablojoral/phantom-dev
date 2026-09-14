import { useMemo } from 'react';
import { contactHeadline, contactKicker } from '../../content/profile.ts';
import { ransomLetterCount, toRansom } from '../RansomText/toRansom.ts';

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
  /** Small label above the sheet headline. */
  readonly kicker: string;
  /** Accessible name of the sheet headline, e.g. "Let's ship it". */
  readonly headlineLabel: string;
  readonly headlineWords: ReadonlyArray<RansomWordView>;
}

export const CONTACT_TITLE = 'Contact';
const TITLE_LINES: ReadonlyArray<ReadonlyArray<string>> = [[CONTACT_TITLE]];

const toLines = (lines: ReadonlyArray<ReadonlyArray<string>>): ReadonlyArray<RansomLineView> => {
  let next = 0;
  return lines.map((line, lineIndex) => ({
    key: `line-${lineIndex}`,
    words: line.map((word, wordIndex) => {
      const startIndex = next;
      next += ransomLetterCount(word);
      return { key: `${lineIndex}-${wordIndex}-${word}`, text: toRansom(word), startIndex };
    }),
  }));
};

export const useContactWords = (): ContactWords =>
  useMemo(
    () => ({
      titleLabel: CONTACT_TITLE,
      titleLines: toLines(TITLE_LINES),
      kicker: contactKicker,
      headlineLabel: contactHeadline,
      headlineWords: toLines([contactHeadline.split(' ').filter((word) => word.length > 0)])[0]?.words ?? [],
    }),
    [],
  );
