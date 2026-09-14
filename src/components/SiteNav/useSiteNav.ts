import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { useMenu } from '../../hooks/useMenu.ts';
import type { MenuController } from '../../hooks/useMenu.ts';
import { useSmoothScroll } from '../../hooks/useSmoothScroll.ts';
import type { HashLinkHandler } from '../../hooks/useSmoothScroll.ts';
import type { MenuLink } from '../Menu/Menu.tsx';

export const MENU_ID = 'site-menu';

export const MENU_LINKS: ReadonlyArray<MenuLink> = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export interface SiteNavController extends MenuController {
  readonly navigate: HashLinkHandler;
}

export const useSiteNav = (): SiteNavController => {
  const menu = useMenu();
  const { close } = menu;
  const scrollToHash = useSmoothScroll();

  // Close first so the section, not the burger, ends up with focus.
  const navigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      close({ restoreFocus: false });
      scrollToHash(event);
    },
    [close, scrollToHash],
  );

  return { ...menu, navigate };
};
