# Breachline Pixel — Claude project guidance

This file is loaded automatically by Claude Code when working inside this project.

## Project

Original pixel-art top-down tactical breach game, single-page web app.

- `index.html` — shell. Loads `src/styles.css` and `src/game.js?v=<bust>`.
- `src/game.js` — entire game (Safari-compatible JS, no `?.` / `??` / `||=` / `replaceAll`).
- `src/styles.css` — UI styles.
- `assets/` — runtime art. `runtime-atlas.png` is the gameplay sprite sheet.
- `progress.md` — running changelog. Append to it after a substantive change.
- `ASSETS_TODO.md` — backlog of raster assets that need to be painted by Codex / image-gen.

Dev server: `npm run dev` (just `python3 -m http.server 5173`). Open http://127.0.0.1:5173/.

## Asset rules (READ THIS FIRST)

**DO NOT generate SVG art for in-game assets.** That includes operator portraits, mission
banners, weapon icons, enemy sprites, VFX, key art, or anything that lives on the canvas
or in a mission/operator card.

The art pipeline is:
1. Codex / image-gen produces painted raster assets (PNG, occasionally JPG) following
   `ASSETS_TODO.md`.
2. Those rasters land in `assets/` under the slug listed in `ASSETS_TODO.md`.
3. The game loader picks them up; if a file is missing the existing fallback renders.

Until painted assets arrive, use one of these **placeholders** in code:
- Solid coloured rect drawn directly on the canvas (`ctx.fillStyle = colors.*; ctx.fillRect(...)`).
- A short text glyph (`drawEditorGlyph`, or `drawText` with a 1–2 character label).
- The existing palette tokens in `src/styles.css` (`--color-*`) — do not invent new ones.

If a feature needs a new asset that isn't in `ASSETS_TODO.md` yet, add an entry to
`ASSETS_TODO.md` (slug, size, purpose, wire-up location). Do **not** ship the feature
with a hand-rolled SVG to fill the gap.

**No SVG asset exceptions remain:**
- The Breachline Pixel logo, lockup, favicon, portraits, tactical icons, and wall pieces
  are raster PNGs generated into `assets/generated-ui-asset-sheet.png`.
- Do not add SVGs for placeholders or brand marks. Request or generate a PNG raster
  entry in `ASSETS_TODO.md` instead.

If you're not sure whether something counts as "game art", default to placeholder + a
`ASSETS_TODO.md` entry.

## Code rules

- Safari-compatible JS only. No `?.`, `??`, `||=`, `?.()`, or `String#replaceAll`. The
  Safari syntax scan is part of the verification gate: `grep -nE "\?\.|(\?\?)|(\|\|=)|\.replaceAll\(" src/game.js` must return empty.
- After any `src/game.js` edit: run `node --check src/game.js` and bump the
  `?v=<slug>` cache-bust in `index.html`.
- Append a 1-line entry to `progress.md` for substantive changes.
- Match the existing colour tokens. Dark teal `#0d1614`, plate `#1d2c29` / `#39524c`,
  accent yellow `#e8d270` / `#ffe98a`, friendly cyan `#62b6a6`, hostile red `#d26a5d`,
  civilian cyan, gold objectives.

## Multi-floor / squad / floor-map context

These systems are already wired (see `progress.md`). Don't re-design them:
- `state.floors = { map, levels }` is built per mission by `deriveFloorMap()`.
- Every operator and enemy has `level`. Stair tiles are bridges and keep prior level.
- Enemies belong to a `squadId`; `state.enemyIntel.squadAlert[squadId]` tracks per-squad
  alert; sentries / armored hold inside `leashRange`; rushers / flankers / suppressors
  reinforce at `state.enemyIntel.reinforce`.

When extending these, add to the existing structures rather than introducing parallel
ones.
