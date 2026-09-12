import { Burger } from '../Burger/Burger.tsx';
import { Menu } from '../Menu/Menu.tsx';
import { MENU_ID, MENU_LINKS, useSiteNav } from './useSiteNav.ts';

export const SiteNav = () => {
  const nav = useSiteNav();
  return (
    <>
      <Burger open={nav.open} controlsId={MENU_ID} buttonRef={nav.burgerRef} onToggle={nav.toggle} />
      <Menu
        id={MENU_ID}
        open={nav.open}
        links={MENU_LINKS}
        firstLinkRef={nav.firstLinkRef}
        onNavigate={nav.navigate}
        onClose={nav.closeFromButton}
      />
    </>
  );
};
