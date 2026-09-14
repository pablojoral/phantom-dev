# Pablo Joral portfolio — project conventions

## Stack
- Vite 8 + React 19 + TypeScript 6 (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- npm is the package manager here (`npm run dev` / `build` / `lint`). Lint is oxlint.
- Single-page, no router, no server state. No `any`, no `!important`.

## Where things live
- `src/content/profile.ts` — ALL personal copy (name, tagline, email, lede, skills, projects, experience, socials). Components render from it; edit this file to personalise, never the components.
- `src/components/<Name>/<Name>.tsx` + `<Name>.module.css` + optional `use<Name>.ts` (co-located logic). Named exports only.
- `src/hooks/` — shared hooks (`useMenu`, `useCopyToClipboard`, `useSmoothScroll`).
- `src/styles/global.css` — design tokens + shared classes (imported once from `main.tsx`).

## Styling rules
- Every color comes from a `:root` token in `global.css` (`--red`, `--ink`, `--paper`, ...). Never hardcode a hex in a module. Single dark theme by design; no light mode.
- Shared devices stay global and are referenced by string: `.label`, `.panel*`, `.tab`, `.sec-head`, `.wrap`, `.vh`. Do not duplicate them into modules.
- `.rWrap` / `.r` are not shared devices: they are unstyled hook classes owned by `RansomText` (its module holds the look). Other modules may target them via `:global(...)` for animation only, never restyle them.
- Component-specific rules live in the component's CSS Module (camelCase keys). When a module rule must target a shared class, use `:global(.panel--red) .chips li` — keep the same selector shape as before so specificity is unchanged.
- Keyframes live in the module that uses them.
- The visual result is hand-tuned (clip-path tears, skews, ransom rotations). Change architecture freely; do not change design values without being asked.

## File size
- Suggest splitting any file over 250 lines. Hard ceiling 400 lines — refactor before adding to a file that large.
