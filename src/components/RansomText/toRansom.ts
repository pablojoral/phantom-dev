/** Wraps every non-space character as a `[X]` ransom letter, so plain copy can be set in scraps. */
export const toRansom = (text: string): string =>
  Array.from(text, (char) => (char === ' ' ? char : `[${char}]`)).join('');
