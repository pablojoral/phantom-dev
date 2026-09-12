import { name } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={cx(styles.footer, 'wrap')}>
    <p>© 2026 {name} · Built with React, Vite, and a lot of red.</p>
    <p className={styles.small}>Persona 5 is © ATLUS. This is a fan-styled personal page.</p>
  </footer>
);
