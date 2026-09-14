type ClassValue = string | false | null | undefined;

/** Joins class names, dropping falsy entries (CSS Module keys are `string | undefined`). */
export const cx = (...values: ReadonlyArray<ClassValue>): string =>
  values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
