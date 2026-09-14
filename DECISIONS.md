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

## 2026-09-13 — Experience motion uses CSS scroll-driven animations, no JS

**Decision.** The Velvet Room timeline (spine draw, contracts sliding in from alternating sides, node stamps, staggered bullets, Training row) animates with CSS `animation-timeline` / `view-timeline`, wrapped in `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`. Only the individual `translate`, `rotate`, `scale` and `opacity` properties animate, so the existing `transform` tilts compose rather than get overridden. No JavaScript or IntersectionObserver. **Consequences.** Unsupported browsers and reduced-motion users get the static layout with everything visible. `.page` moves from `overflow-x: hidden` to `overflow-x: clip` (with `hidden` as a fallback declaration), because `hidden` turns `.page` into a scroll container that would capture every `view()` timeline. The spine becomes a `::before` bar instead of a `border-left` so it can be scaled.

**2026-09-13 note.** Touch devices also get scroll-driven motion for the Mementos screenshot fan (hover stays for mouse): each card has its own named view timeline, `timeline-scope` on the list lets a card's fold run on the timeline of the card below, so one card's fold and the next card's spread share the same scroll band and stay in sync; guarded additionally by `@supports (timeline-scope: --x)`.

## 2026-09-13 — Hero rebuilt as a layered grid composition after a Persona 5 menu reference

**Decision.** The header is a collage modelled on a Persona 5 fan-made name-entry menu, minus its card carousel, with the hero copy where its login form sits. `Hero.tsx` is a grid that only places and layers seven pieces (`HeroShards`, `HeroTitle`, `HeroDossier`, `HeroHeadline`, `HeroMugshot`, `HeroFigure`, `HeroNext`, plus a shared `XMark`); each piece owns its own module and keyframes. It replaces `CallingCard` and `Portrait`; "Press start" becomes the ransom-letter NEXT link. The shattered-glass ground is an inline SVG whose shards take their colour from CSS classes (`.red { fill: var(--red) }`), because SVG attributes cannot read custom properties; that keeps the tokens-only rule. **Consequences.** Explicit z-index layers (shards 0 → Next 5) carry the overlaps, so layout changes should keep that order. The name's outline is a stack of hard `drop-shadow` steps on the word group, because `.rWrap` / `.r` stay unstyled hooks owned by RansomText.

**2026-09-13 note.** The hero's NEXT link (`HeroNext`, "Next: skills") was removed at the user's request; the hero now has six pieces, the desktop grid three rows, and the z-index layers stop at 4. `XMark` stays for the mugshot.

**2026-09-13 note.** The red tint, greyscale filter and hover-to-colour fade moved from the hero figure to the mugshot (hover limited to real-hover devices); the figure now rests in full colour with only the halftone dots. The mugshot's red X was removed, leaving `XMark` unused, so it was deleted.

## 2026-09-13 — The page ending mirrors the hero; shared hero pieces extracted

**Decision.** Contact and the footer are one closing composition in the hero's visual language, mirrored: shattered glass torn along its top edge, the outlined papercut title tilted the other way, the dossier on the right carrying email (with the copy button as its hanging tab), GitHub and LinkedIn as red bars, and a torn paper sheet with "Take your heart" and the mailto button climbing onto the dossier's empty bottom padding. To avoid copying, `Shards` (props `mirror`, `edge`), `Dossier` + `DossierField` (label/bar with an optional label-or-button tab, optional link), `PaperSheet` and `OutlinedRansom` were extracted from the hero; the hero renders the same DOM and computed styles through them. **Consequences.** `Contact` renders a full-bleed wrapper after `<main>` holding `<section id="contact">` (a named region) and the page `<footer>` (contentinfo), so the section is no longer inside `<main>`; `main` lost its bottom padding and the `Footer` component was absorbed. The sheet's letters pop only via a scroll-driven animation.

## 2026-09-13 — Skills show emphasis by tier and visual weight, with no rank data

**Decision.** The Skills section drops ranks, meters and arcana names. `Skill` is `{ name, detail?, tier }` with `tier: 'signature' | 'core' | 'support'`, and no numeric level is stored anywhere. The section is a ransom-note collage in which the tier only picks the kind of cut-out: large torn paper strips with a few papercut letters (signature), red skewed bars (core), small ink chips (support). **Consequences.** Emphasis is visual only; nothing announces or labels a tier, and array order (signature first) keeps the strongest skills first for screen readers. The core bar applies DossierField's `.bar` module class alongside its own, and `PaperSheet` gained an opt-in `flat` prop so the strips can set their own tilt.

**2026-09-13 note.** Signature skills use large ink chips (the support chip, scaled up, plus the red offset shadow), not torn paper strips with papercut letters; all pieces form one centred cluster, and `PaperSheet`'s `flat` prop was removed again.
