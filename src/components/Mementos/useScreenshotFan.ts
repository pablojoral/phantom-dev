import { useMemo } from 'react';
import type { ScreenshotTriple } from '../../content/profile.ts';

export type FanPosition = 1 | 2 | 3;

export interface FanShot {
  readonly key: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  /** CSS `aspect-ratio` value from the real pixel size, so the phone frame never crops the screen. */
  readonly ratio: string;
  readonly position: FanPosition;
}

const toShots = (screenshots: ScreenshotTriple, name: string): ReadonlyArray<FanShot> =>
  screenshots.map(({ src, width, height, alt }, i) => {
    const position = (i + 1) as FanPosition;
    return {
      key: `${position}-${src}`,
      src,
      alt: alt ?? `${name} screenshot ${position}`,
      width,
      height,
      ratio: `${width} / ${height}`,
      position,
    };
  });

export const useScreenshotFan = (screenshots: ScreenshotTriple, name: string): ReadonlyArray<FanShot> =>
  useMemo(() => toShots(screenshots, name), [screenshots, name]);
