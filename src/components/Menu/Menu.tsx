import type { RefObject } from 'react';
import type { HashLinkHandler } from '../../hooks/useSmoothScroll.ts';
import { cx } from '../../utils/cx.ts';
import { RansomText } from '../RansomText/RansomText.tsx';
import { useMenuItems } from './useMenuItems.ts';
import styles from './Menu.module.css';

export interface MenuLink {
  readonly label: string;
  readonly href: string;
}

export interface MenuProps {
  readonly id: string;
  readonly open: boolean;
  readonly links: ReadonlyArray<MenuLink>;
  readonly firstLinkRef: RefObject<HTMLAnchorElement | null>;
  readonly onNavigate: HashLinkHandler;
}

export const Menu = ({ id, open, links, firstLinkRef, onNavigate }: MenuProps) => {
  const items = useMenuItems(links);
  return (
    <nav className={cx(styles.menu, open && styles.isOpen)} id={id} aria-label="Sections" hidden={!open}>
      <p className={styles.label}>
        <span>Menu</span>
      </p>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.key} className={styles.item}>
            <a
              ref={index === 0 ? firstLinkRef : undefined}
              className={styles.link}
              href={item.href}
              aria-label={item.label}
              onClick={onNavigate}
            >
              <span aria-hidden="true">
                <RansomText text={item.text} style="mix" leadTone="paper" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
