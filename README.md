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

Each project card fans out three phone screenshots on hover (scroll on touch) and opens them in a gallery. Put the captures in `public/screenshots/` and list them in the project's `screenshots` as `{ src, width, height, alt }`, using each image's real pixel size: the phone frames take that aspect ratio, so screens of any shape show uncropped. `alt` is optional (the gallery falls back to "<project> screenshot <n>"). Projects under NDA: keep `CONFIDENTIAL_SCREENSHOTS`.
