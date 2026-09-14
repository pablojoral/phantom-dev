import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { ransomDeck, ransomVariation } from './ransomVariation.ts';
import type { RansomCut, RansomFont, RansomStyle, RansomVariation } from './ransomVariation.ts';

export type RansomTone = 'ink' | 'paper' | 'redOnPaper';
export type RansomLeadTone = Exclude<RansomTone, 'redOnPaper'>;

export type RansomPiece =
  | { readonly kind: 'text'; readonly key: string; readonly value: string }
  | {
      readonly kind: 'letter';
      readonly key: string;
      readonly char: string;
      readonly font: RansomFont;
      readonly cut: RansomCut;
      readonly tone: RansomTone;
      readonly style: CSSProperties;
    };

export interface RansomTextOptions {
  readonly text: string;
  /** When set, letters receive `--i` starting here (hero stagger animation). */
  readonly startIndex?: number | undefined;
  readonly style?: RansomStyle | undefined;
  /** Tone of the first non-hot letter; the rest alternate from it. */
  readonly leadTone?: RansomLeadTone | undefined;
  /**
   * Seed for the face/cut dealing order and the per-letter hash; defaults to `text`.
   * Give several calls the same salt (plus `startIndex` offsets) to deal one deck across them.
   */
  readonly salt?: string | undefined;
}

type Mode = 'plain' | 'ransom' | 'hot';

const MODE_BY_BRACKET: Readonly<Record<string, Mode>> = {
  '[': 'ransom',
  '{': 'hot',
  ']': 'plain',
  '}': 'plain',
};

const RANSOM_SYNTAX = /[[\]{}]/g;

/** The title as a screen reader should hear it: brackets stripped. */
export const stripRansomSyntax = (text: string): string => text.replace(RANSOM_SYNTAX, '');

const letterStyle = (variation: RansomVariation, staggerIndex: number | undefined): CSSProperties =>
  // Custom properties drive the stagger delay and the per-letter transform in CSS;
  // CSSProperties has no slot for them.
  ({
    '--rot': `${variation.rot}deg`,
    '--sc': variation.sc,
    '--dy': `${variation.dy}em`,
    ...(staggerIndex === undefined ? {} : { '--i': staggerIndex }),
  }) as CSSProperties;

/**
 * Alternating tones keep every scrap in contrast with its neighbours; with the
 * overlap, two adjacent same-tone scraps would read as one piece of paper.
 */
const letterTone = (hot: boolean, index: number, leadTone: RansomLeadTone): RansomTone => {
  if (hot) return 'redOnPaper';
  const alternate = leadTone === 'ink' ? 'paper' : 'ink';
  return index % 2 === 0 ? leadTone : alternate;
};

/**
 * Parses the ransom mini-syntax: `[X]` marks ransom letters, `{X}` marks hot
 * (red-on-paper) ransom letters, everything else is plain text. Every letter's
 * look is derived from a hash of the text, its char and position, so renders are stable.
 */
export const parseRansomText = ({
  text,
  startIndex,
  style = 'mix',
  leadTone = 'ink',
  salt,
}: RansomTextOptions): ReadonlyArray<RansomPiece> => {
  const pieces: RansomPiece[] = [];
  let mode: Mode = 'plain';
  let buffer = '';
  let letterIndex = 0;
  let previous: RansomVariation | undefined;
  const deck = ransomDeck(salt ?? text);
  const dealOffset = startIndex ?? 0;

  const flush = () => {
    if (buffer.length > 0) {
      pieces.push({ kind: 'text', key: `t${pieces.length}`, value: buffer });
      buffer = '';
    }
  };

  for (const char of text) {
    const nextMode = MODE_BY_BRACKET[char];
    if (nextMode !== undefined) {
      flush();
      mode = nextMode;
      continue;
    }
    if (mode === 'plain') {
      buffer += char;
      continue;
    }
    const variation = ransomVariation({ char, index: dealOffset + letterIndex, style, deck, previous });
    pieces.push({
      kind: 'letter',
      key: `l${pieces.length}`,
      char,
      font: variation.font,
      cut: variation.cut,
      tone: letterTone(mode === 'hot', letterIndex, leadTone),
      style: letterStyle(variation, startIndex === undefined ? undefined : startIndex + letterIndex),
    });
    previous = variation;
    letterIndex += 1;
  }
  flush();
  return pieces;
};

export const useRansomText = ({ text, startIndex, style, leadTone, salt }: RansomTextOptions): ReadonlyArray<RansomPiece> =>
  useMemo(() => parseRansomText({ text, startIndex, style, leadTone, salt }), [text, startIndex, style, leadTone, salt]);
