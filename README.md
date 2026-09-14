# Pablo Joral portfolio

A red-and-black papercut-collage portfolio page for a mobile software engineer: fixed hamburger + full-screen pause menu, a collage hero laid out like a game's name-entry screen (shattered-glass ground, papercut name, dossier panel, a full-colour portrait and a red-tinted mugshot), sections for skills, projects and experience, and a closing contact scene that mirrors the hero, with the footer on the same shattered glass.

Built with Vite, React 19 and TypeScript; styles are plain CSS with CSS Modules per component.

## Run it

```sh
npm install
npm run dev     # local dev server with HMR
npm run build   # type-check + production build into dist/
npm run lint    # oxlint
```

## Make it yours

Edit `src/content/profile.ts`. Name, tagline, email, lede, skills, projects, experience and social links all live in that one typed file; the components only render what they find there.

Put a square portrait at `public/profile.jpg` (about 400×400, face roughly centred). The hero uses it twice: large and in full colour on the right, and as a tight red-tinted close-up in the framed mugshot (full colour on hover). Until it exists, the large shard shows where to drop it.

Each project card fans out three phone screenshots on hover and opens them in a gallery on click; on touch screens the first tap shows the fan and a second tap opens the gallery. Projects marked `confidential: true` have no screenshots and no fan: a single click, tap or Enter shakes the card and shows a "classified" notice (copy in `confidentialNotice`) instead of a gallery. Put the captures in `public/screenshots/` and list them in the project's `screenshots` as `{ src: asset('/screenshots/…'), width, height, alt }`, using each image's real pixel size: the phone frames take that aspect ratio, so screens of any shape show uncropped. `alt` is optional (the gallery falls back to "<project> screenshot <n>"). Projects under NDA: set `confidential: true` and leave out `screenshots`.

## Deploy

GitHub Pages publishes the `gh-pages` branch, which holds production at its root and pull-request previews under `pr-preview/`.

- **Production:** merging to `master` runs `.github/workflows/deploy-pages.yml` (lint, build, push `dist` to `gh-pages`) and updates <https://pablojoral.github.io/phantom-dev/>. It can also be run by hand from the Actions tab. Production deploys leave `pr-preview/` untouched.
- **Previews:** every pull request into `staging` gets its own build at `https://pablojoral.github.io/phantom-dev/pr-preview/pr-<n>/` (`.github/workflows/pr-preview.yml`). A comment on the PR links to it, it updates on every push, and it is removed when the PR closes.

One-time setup in the repository settings:

- **Settings → Pages → Build and deployment:** "Deploy from a branch", branch `gh-pages`, folder `/ (root)`. The branch exists after the first production run (or the first preview).
- **Settings → Actions → General → Workflow permissions:** "Read and write permissions", so the workflows can push to `gh-pages` and comment on PRs.
- GitHub Pages on a private repository needs a paid plan (Pro, Team or Enterprise); on the free plan the repository has to be public.
- Outside GitHub Enterprise, a Pages site is publicly reachable even when the repository is private, and that includes every PR preview.

A project page lives under a sub-path, so the workflows pass it to the build as `PAGES_BASE_PATH` (`/phantom-dev` for production, `/phantom-dev/pr-preview/pr-<n>` for previews). `vite.config.ts` turns that into Vite's `base`, and files from `public/` are referenced through `asset()` (`src/content/asset.ts`), which prefixes `import.meta.env.BASE_URL`. Without the variable, `npm run dev` and `npm run build` use `/`. `public/.nojekyll` stops Pages from running Jekyll over the built files.

### Quality checks

`.github/workflows/quality.yml` runs on every pull request into `staging` and every push to it:

- lint, type check and build;
- Lighthouse CI (`lighthouserc.json`, 3 runs against the built `dist`): accessibility below 0.9 fails the check; best practices and SEO below 0.9, and performance below 0.8, only warn;
- a link check with lychee over the built HTML and this README (mail links, `linkedin.com`, `localhost`, the bare Google Fonts preconnect hosts and the Pages site itself excluded).

Run Lighthouse locally with `npm run build && npx @lhci/cli@0.14 autorun --config=./lighthouserc.json`; reports land in `.lighthouseci/` (git-ignored).
