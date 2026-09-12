import { useMemo } from 'react';
import type { ScreenshotTriple } from '../../content/profile.ts';

export type FanPosition = 1 | 2 | 3;

export interface FanShot {
  readonly key: string;
  readonly src: string;
  readonly alt: string;
  readonly position: FanPosition;
}

const toShots = (screenshots: ScreenshotTriple, name: string): ReadonlyArray<FanShot> =>
  screenshots.map((src, i) => {
    const position = (i + 1) as FanPosition;
    return { key: `${position}-${src}`, src, alt: `${name} screenshot ${position}`, position };
  });

export const useScreenshotFan = (screenshots: ScreenshotTriple, name: string): ReadonlyArray<FanShot> =>
  useMemo(() => toShots(screenshots, name), [screenshots, name]);
