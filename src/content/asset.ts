/**
 * Resolves a file in `public/` against the deploy base: `/` locally, `/phantom-dev/` on GitHub Pages
 * (set at build time through `PAGES_BASE_PATH`, see vite.config.ts). Never doubles a slash.
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
