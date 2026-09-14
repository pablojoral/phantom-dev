/** Characters kept as plain text in a papercut phrase: spaces and apostrophes (no tiny paper squares). */
const PLAIN_CHARS: ReadonlySet<string> = new Set([' ', "'", '’']);

/** Wraps every other character as a `[X]` ransom letter, so plain copy can be set in scraps. */
export const toRansom = (text: string): string =>
  Array.from(text, (char) => (PLAIN_CHARS.has(char) ? char : `[${char}]`)).join('');

/** How many scraps `toRansom(text)` produces, for `startIndex` / `--i` offsets. */
export const ransomLetterCount = (text: string): number => Array.from(text).filter((char) => !PLAIN_CHARS.has(char)).length;
