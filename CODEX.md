# Breachline Pixel — Codex project guidance

This file briefs Codex (or any image-gen / coding agent) on how to contribute to
Breachline Pixel.

## What Codex owns

**Painted raster assets.** Everything listed in `ASSETS_TODO.md` — the runtime atlas,
operator portraits, enemy sprites, mission banners, weapon icons, VFX spritesheets,
hero key art, floor-divider tiles, stair tiles, and so on.

When Codex can generate art, **prefer image generation over any hand-rolled vector or
ASCII placeholder**. Painted PNGs are the target. Vector SVG should not be used for
in-game art (see "Style + rules" below).

## What Codex must NOT do

- **Do not generate SVGs.** All brand marks, portraits, tactical icons, wall pieces, and
  editor/game assets are PNG raster art, with shared UI art packed into
  `assets/generated-ui-asset-sheet.png`.
- Do not invent slugs. Use the exact filenames in `ASSETS_TODO.md`. If a new asset is
  needed, append a row to `ASSETS_TODO.md` first (slug, size, purpose, wire-up location),
  then generate to that filename.
- Do not change the palette. Use the colour tokens listed under "Style + rules".
- Do not include real-world insignia, faces, or licensed logos.
- Do not upscale low-res output to fake a higher tier. Render at the native pixel size
  listed for the slug (32×32, 38×38, 480×120, 1920×960, etc.) with no antialiasing on
  pixel-art tiers.

## Workflow

1. Read `ASSETS_TODO.md` top-to-bottom before generating. Tiers are ordered by impact:
   Tier 1 (atlas repaint) → Tier 2 (portraits + banners + key art) → Tier 3 (weapons) →
   Tier 4a (stairs + floor chips) → Tier 4b (enemy / squad sprites) → Tier 5 (audio).
2. Generate the asset(s) for one tier at a time, exact filename, exact size.
3. Drop the file into `assets/<slug>.png`; SVG files are not used in this project.
4. For each new slug not already wired into `src/game.js`:
   - Add a slug → path entry in the `imageAssets` map.
   - Replace the existing fallback in the render function listed by the `ASSETS_TODO.md`
     row (campaign card, portrait, hub, etc.).
   - Bump the `?v=<slug>` cache-bust in `index.html`.
   - Append a 1-line note to `progress.md`.
5. Maintain consistency. If two assets share a subject (operator at 38×38 in atlas vs.
   96×96 portrait), reuse silhouette / palette / accent so they read as the same
   character.

## Style + rules

- Pure pixel art, 1× pixel grid, no antialiasing.
- Top-down view for tiles + units. Side-on for weapon icons. 3/4 cutaway for key art.
- Palette tokens (from `src/styles.css`):
  - Dark teal background `#0d1614`
  - Plate `#1d2c29` / `#39524c`
  - Friendly cyan `#62b6a6`
  - Accent yellow `#e8d270` / `#ffe98a`
  - Hostile red `#d26a5d`
  - Gold objectives, cyan civilians.
- Operators are 2-head-tall chibi tactical kit: plate carrier, helmet, sidearm visible.
- Enemy roles must read at a glance — see `ASSETS_TODO.md` Tier 4b for per-role
  silhouette guidance (sentry rooted, armored shielded, rusher light kit, flanker side
  angles, suppressor belt-fed).
- Mission banners: 32px dark gutter on the left for the card title overlay.

## When to ask vs. when to ship

- If the slug, size, and wire-up location are already in `ASSETS_TODO.md`: ship it.
- If you need a new slug: add the `ASSETS_TODO.md` row first, then ship.
- If the request seems to need vector art for in-game UI: stop and propose a raster
  alternative; do not generate an SVG.
- If image-gen is unavailable, leave the existing placeholder (solid rect, glyph text,
  fallback sprite) in place rather than substituting a hand-drawn SVG.

## Verification before handoff

After dropping new assets and wiring them in:
- `node --check src/game.js` must pass.
- `grep -nE "\?\.|(\?\?)|(\|\|=)|\.replaceAll\(" src/game.js` must return empty
  (Safari compatibility).
- The dev server (`python3 -m http.server 5173`) should return 200 for `/`, the bumped
  `src/game.js?v=<slug>`, and each new asset URL.
- Append a 1-line entry to `progress.md` describing what shipped.
