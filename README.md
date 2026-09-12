# Phantom Dev

A Persona 5 styled personal portfolio page for a mobile software engineer: fixed hamburger + full-screen pause menu, a calling-card hero with a halftone wanted-poster portrait, and sections for skills (Confidants), projects (Mementos), experience (Velvet Room) and contact.

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

Put a square portrait at `public/profile.jpg` (about 400×400). Until it exists, the hero shows a red panel telling you where to drop it.

Each project card fans out three phone screenshots (390×844, or any 9:19.5) on hover. Projects under NDA: keep `CONFIDENTIAL_SCREENSHOTS`; otherwise point `screenshots` at real captures in `public/screenshots/`.

## Disclaimer

Persona 5 is © ATLUS. This is a fan-styled personal page with no affiliation to or endorsement by ATLUS or SEGA.
