export const RANSOM_FONTS = ['anton', 'bangers', 'passion', 'mono', 'serif', 'bowlby', 'abril', 'stencil', 'bebas'] as const;
export type RansomFont = (typeof RANSOM_FONTS)[number];
export type RansomStyle = RansomFont | 'mix';

export const RANSOM_CUTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type RansomCut = (typeof RANSOM_CUTS)[number];

export interface RansomVariation {
  readonly font: RansomFont;
  readonly cut: RansomCut;
  /** Degrees, −9…+9 in 0.1° steps. */
  readonly rot: number;
  /** Scale factor, 0.92…1.12. */
  readonly sc: number;
  /** Baseline offset in em, −0.08…+0.08. */
  readonly dy: number;
}

const ROT_RANGE = 9;
const ROT_STEPS = ROT_RANGE * 2 * 10 + 1;
const SC_MIN = 0.92;
const SC_STEPS = 21;
const DY_RANGE = 0.08;
const DY_STEPS = 17;

/** 32-bit FNV-1a; small, allocation-free and stable across renders and sessions. */
export const hashString = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

/** Keeps emitted CSS values free of floating-point noise (`0.07`, not `0.06999…`). */
const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Deterministic Fisher–Yates shuffle driven by a xorshift32 stream seeded from `seed`,
 * so one text always deals its faces and cuts in the same order.
 */
export const shuffled = <T>(options: readonly [T, ...T[]], seed: number): readonly [T, ...T[]] => {
  const order = [...options] as [T, ...T[]];
  let state = seed || 0x9e3779b9;
  for (let i = order.length - 1; i > 0; i -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    const a = order[i] ?? order[0];
    order[i] = order[j] ?? order[0];
    order[j] = a;
  }
  return order;
};

/** Deals `order[index]` wrapping round; steps on if it would repeat the previous letter's pick. */
const deal = <T>(order: readonly [T, ...T[]], index: number, avoid: T | undefined): T => {
  const first = order[index % order.length] ?? order[0];
  if (first !== avoid) return first;
  return order[(index + 1) % order.length] ?? order[0];
};

/** Per-text dealing order for faces and cuts: no face repeats until all nine have been used. */
export interface RansomDeck {
  readonly salt: string;
  readonly fonts: readonly [RansomFont, ...RansomFont[]];
  readonly cuts: readonly [RansomCut, ...RansomCut[]];
}

export const ransomDeck = (text: string): RansomDeck => {
  const seed = hashString(text);
  return { salt: text, fonts: shuffled(RANSOM_FONTS, seed), cuts: shuffled(RANSOM_CUTS, seed ^ 0x5bd1e995) };
};

export interface VariationInput {
  readonly char: string;
  readonly index: number;
  readonly style: RansomStyle;
  readonly deck: RansomDeck;
  /** Variation of the previous ransom letter, so neighbours are forced to differ. */
  readonly previous: RansomVariation | undefined;
}

export const ransomVariation = ({ char, index, style, deck, previous }: VariationInput): RansomVariation => {
  // Salted with the whole text so the same letter at the same position differs between words.
  const hash = hashString(`${deck.salt}|${char}${index}`);
  const font = style === 'mix' ? deal(deck.fonts, index, previous?.font) : style;
  const cut = deal(deck.cuts, index, previous?.cut);
  const rot = round2(((hash >>> 8) % ROT_STEPS) / 10 - ROT_RANGE);
  const sc = round2(SC_MIN + ((hash >>> 16) % SC_STEPS) / 100);
  const dy = round2(((hash >>> 20) % DY_STEPS) / 100 - DY_RANGE);
  return { font, cut, rot, sc, dy };
};
