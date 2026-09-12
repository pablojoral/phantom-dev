import { useMemo } from 'react';
import { stripRansomSyntax } from '../RansomText/useRansomText.ts';

/** Accessible name for the heading: the ransom title with its brackets stripped. */
export const useSectionHead = (title: string): string => useMemo(() => stripRansomSyntax(title), [title]);
