# Architectural decisions

Append-only. Never silently reverse an entry; add a superseding one.

## 2026-09-12 — Port the single-file page to Vite + React 19 + TypeScript with CSS Modules

**Context.** The site started as one hand-written HTML file (`_legacy-index.html`, ~930 lines) with a large `<style>` block and a vanilla script. It worked, but personalising it meant editing markup in several places, and adding anything meant growing a single file.

**Decision.**
- Build tool / framework: Vite + React 19 + TypeScript (strict). No router, no server state, no UI library.
- Styling: plain CSS with CSS Modules per component, plus one global stylesheet for tokens and shared devices. Chosen over Tailwind or styled-components so the hand-tuned `clip-path` polygons, skews, `:nth-child` ransom rotations and keyframes are kept verbatim rather than translated into a utility vocabulary or template literals.
- Content as data: all personal copy lives in `src/content/profile.ts` as typed, readonly constants. Components are pure renderers of that file.
- Behaviour moves from `querySelectorAll` bindings to hooks (`useMenu`, `useCopyToClipboard`, `useSmoothScroll`) driven by refs and React events; the closed menu uses the `hidden` attribute from state so it stays out of the tab order.

**Consequences.** The rendered page is visually identical to the legacy file. Shared classes (`.panel`, `.tab`, `.r`, `.label`, ...) remain global by design, so module rules that need them use `:global(...)`. The package manager for this project is npm, which differs from the yarn convention used elsewhere.

## 2026-09-12 — RansomText owns its look; `.r` becomes a hook class; variation is hash-deterministic

**Context.** Ransom letters were styled globally (`.r`, `:nth-child(3n…)` rotations, `.r--hot`, `.tab .r`) with a single face on flat rectangles, which read as "one font, tilted" rather than as cut-out magazine scraps.

**Decision.**
- All ransom-letter styling lives in `src/components/RansomText/RansomText.module.css`. `global.css` no longer styles `.r`; `.r` (inner paper) and `.rWrap` (outer glue layer) remain in the markup only as stable global hooks — `Hero.module.css` animates `.hero :global(.rWrap)`. Nothing else may restyle them.
- Each letter is an outer wrapper (`filter: drop-shadow`, overlap margin, alternating `z-index`, hero `pop` animation) around an inner scrap (face, tone, `clip-path` cut, `rotate/translateY/scale`). The animation and the static transform sit on different elements so they never fight; `pop` is now a pure scale.
- Typeface is a closed union (`RANSOM_FONTS`: `anton | bangers | passion | mono | serif`; `RansomStyle` adds `mix`), exposed as `style` on `RansomText`, `SectionHead` and `CallingCard`. Faces map to `:root` font tokens (`--display`, `--ransom`, `--ransom-passion`, `--ransom-mono`, `--ransom-serif`) via module classes, each with an optical-size multiplier.
- Every per-letter choice (face in `mix`, cut shape, rotation, scale, baseline) derives from a 32-bit FNV-1a hash of `${char}${index}` in `ransomVariation.ts`; adjacent letters are bumped so they never share a face or cut. Tone alternates by letter parity from a `leadTone` (`ink` on panels, `paper` inside the red tab); hot `{X}` letters are always `redOnPaper`. No `Math.random`, no `:nth-child` design rules.
- Section-head titles carry the same `aria-label` + `aria-hidden` pattern as the hero (`Tab` heading gained an optional `label`).

**Consequences.** The same word always renders identically across re-renders and sessions. Per-letter CSS custom properties (`--i`, `--rot`, `--sc`, `--dy`) are set on the wrapper and inherited by the scrap. Three more Google Fonts load (`Passion One`, `Rubik Mono One`, `Playfair Display`).

## 2026-09-13 — Screenshot gallery is a portal with a minimal in-house focus trap

**Decision.** The project-card gallery (`src/components/Gallery`) renders through `createPortal` into `document.body` so it escapes the card's `transform`/`filter` stacking contexts, and implements its own modal plumbing in `useGallery.ts` (body scroll lock via `body.gallery-open`, focus to the close button, Tab wrap inside the dialog ref, Escape/backdrop to close, focus back to the opening card) instead of adding a dialog library or the native `<dialog>` element. **Why.** The page has no dependencies beyond React and only one focusable control inside the dialog; a library or `<dialog>` polyfill would cost more than the ~20 lines it replaces.
