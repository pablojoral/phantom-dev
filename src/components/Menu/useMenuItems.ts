import { useMemo } from 'react';
import { toRansom } from '../RansomText/toRansom.ts';
import type { MenuLink } from './Menu.tsx';

export interface MenuItem extends MenuLink {
  readonly key: string;
  /** The label in ransom syntax, one scrap per letter. */
  readonly text: string;
}

const toItem = (link: MenuLink): MenuItem => ({ ...link, key: link.href, text: toRansom(link.label) });

export const useMenuItems = (links: ReadonlyArray<MenuLink>): ReadonlyArray<MenuItem> =>
  useMemo(() => links.map(toItem), [links]);
