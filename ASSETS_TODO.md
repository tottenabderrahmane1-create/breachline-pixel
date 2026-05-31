# Breachline Pixel — Asset Generation Backlog (for Codex / image-gen)

This file lists the higher-fidelity raster assets Codex (or any image-gen tool) should produce.
All game and brand visuals are PNG/raster sprites and key art in `assets/`.

All raster art **must** be original pixel art. No traced or licensed material.
Palette references live in `src/styles.css` (`--color-*` tokens) and the existing
`assets/runtime-atlas.png`. Match the existing pixel scale (32×32 tile, 38×38 unit, 96×96 logo).

Naming: `assets/<slug>.png` only. Drop new files into `assets/` and the game loader
will pick them up if the slug matches the table below.

---

## Tier 1 — Polish raster sprites (already wired)

| Slug                              | Size      | Existing? | What Codex should make                                                            |
| --------------------------------- | --------- | --------- | --------------------------------------------------------------------------------- |
| `assets/runtime-atlas.png`        | 384×384   | yes       | Higher-detail repaint: floors, walls, door (closed/open), window, crate, smoke, muzzle, flash, op_rook/op_mako/op_lynx/op_volt, hostile_*, civilian, objective, extract. Frame 4 ops in 38×38 cells, 4 facing directions each. |
| `assets/ai-generated-pixel-asset-sheet.png` | 1024×1024 | yes | Source sheet for the runtime atlas. Codex should regenerate with consistent palette and harder reads at the 38px size. |

## Tier 2 — New raster assets (loader stubs to add)

| Slug                                | Size     | Purpose                                                              |
| ----------------------------------- | -------- | -------------------------------------------------------------------- |
| `assets/portrait-rook.png`          | 96×96    | Painted pixel portrait of Rook (Point) — replaces SVG portrait.      |
| `assets/portrait-mako.png`          | 96×96    | Painted pixel portrait of Mako (Assault).                            |
| `assets/portrait-lynx.png`          | 96×96    | Painted pixel portrait of Lynx (Marksman).                           |
| `assets/portrait-volt.png`          | 96×96    | Painted pixel portrait of Volt (Breacher).                           |
| `assets/keyart-hero.png`            | 1920×960 | Wide cinematic key art for the home hub.                             |
| `assets/banner-meridian.png`        | 480×120  | Mission card banner for Operation Meridian Ward (clinic).            |
| `assets/banner-blackglass.png`      | 480×120  | Mission card banner for Operation Blackglass (embassy).              |
| `assets/banner-metro-cutoff.png`    | 480×120  | Mission card banner for Operation Metro Cutoff.                      |
| `assets/banner-nightfall.png`       | 480×120  | Mission card banner for Operation Nightfall (warehouse, night).      |
| `assets/banner-glassline.png`       | 480×120  | Mission card banner for Operation Glassline (training).              |
| `assets/banner-market-lantern.png`  | 480×120  | Mission card banner for Operation Market Lantern (hostage market).   |
| `assets/banner-blackbox.png`        | 480×120  | Mission card banner for Operation Blackbox (server vault).           |
| `assets/banner-dockside-signal.png` | 480×120  | Mission card banner for Operation Dockside Signal.                   |

When Codex delivers these, wire them by:
1. Adding a slug → `assets/<slug>.png` entry in the `imageAssets` map in `src/game.js`.
2. Drawing them in the campaign card / portrait / hub render functions instead of fallback text.

## Tier 3 — Weapon / gear icons (packed May 31, 2026)

The current Armory uses generated raster exports named `assets/weapon-*.png`, packed from
`assets/imagegen-campaign-armory-sheet.png` by `tools/generate_campaign_armory_assets.py`.
The older `wep-*` names below are kept as optional future tighter side-profile repaints.

| Slug                              | Size  | Notes                                            |
| --------------------------------- | ----- | ------------------------------------------------ |
| `assets/wep-m4a1.png`             | 64×24 | Pixel art weapon icon, side profile.             |
| `assets/wep-hk416.png`            | 64×24 | "                                                |
| `assets/wep-mp5a5.png`            | 64×24 | "                                                |
| `assets/wep-mp7.png`              | 64×24 | "                                                |
| `assets/wep-ak74m.png`            | 64×24 | "                                                |
| `assets/wep-benelli-m4.png`       | 64×24 | "                                                |
| `assets/wep-m110-sass.png`        | 64×24 | "                                                |
| `assets/wep-glock17.png`          | 48×24 | "                                                |
| `assets/wep-m249-saw.png`         | 64×24 | "                                                |

Wire in `renderArmoryPanel` once present.

## Tier 3a — Mission thumbnails (packed May 31, 2026)

Generated raster thumbnails now exist for all authored operations:
`assets/mission-training-block.png`, `mission-catacomb.png`, `mission-embassy-annex.png`,
`mission-market-rescue.png`, `mission-greenroom.png`, `mission-yardline.png`,
`mission-server-vault.png`, `mission-steelhouse.png`, `mission-cargo-hold.png`,
`mission-metro-switch.png`, `mission-clinic-tower.png`, `mission-night-depot.png`,
`mission-castiron.png`, `mission-vantage-point.png`, `mission-penthouse.png`, and
`mission-rowhouse.png`.

Gameplay maps do **not** stretch these thumbnails as backgrounds. The mission renderer builds
a full-resolution raster backdrop from the actual 30×20 playable grid so art and collision
always line up.

## Tier 3b — Map tileset (packed May 31, 2026)

Generated tilemap assets now exist under `assets/tile-*.png`, `assets/prop-*.png`,
`assets/decal-*.png`, `assets/marker-*.png`, and `assets/vfx-*.png`, packed from
`assets/tilemap-master.png` by `tools/generate_tilemap_assets.py`. These are wired into
`src/game.js` and are the main in-mission map art pipeline.

Future improvements should regenerate this same sheet layout, not switch back to stretched
full-map images. The renderer depends on exact 8×8 sheet order and 64×64 crop outputs.

## Tier 4 — Atmosphere / VFX

| Slug                              | Size      | Purpose                                                  |
| --------------------------------- | --------- | -------------------------------------------------------- |
| `assets/vfx-breach-flash.png`     | 96×96     | Frame strip for door breach flash (4 frames horizontal). |
| `assets/vfx-smoke-cloud.png`      | 128×128   | Animated smoke spritesheet, 4 frames.                    |
| `assets/vfx-muzzle.png`           | 64×64     | Muzzle flash spritesheet, 3 frames.                      |
| `assets/skybox-night.png`         | 960×640   | Soft night-overlay tint to layer over warehouse maps.    |

## Tier 4a — Multi-floor / stair assets

Multi-floor missions now have real per-tile floor numbers (`state.floors.map`), a
flood-filled BFS that uses stair tiles as bridges, and a Floor X/N HUD badge driven by
the selected operator's `level`. Codex should deliver sprites that read the floor split
at a glance.

| Slug                              | Size       | Purpose                                                                  |
| --------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `assets/tile-stairs-up.png`       | 32×32      | Stair-up tile, top-down pixel view, clear directional arrow.             |
| `assets/tile-stairs-down.png`     | 32×32      | Stair-down counterpart for the other floor's matching tile.              |
| `assets/floor-divider.png`        | 32×64      | Solid floor-to-floor wall tile (load-bearing), used to draw the level divider distinct from interior walls. |
| `assets/floor-icon-1.png`         | 16×16      | Raster "L1" chip for the minimap and unit rows.                          |
| `assets/floor-icon-2.png`         | 16×16      | Raster "L2" chip.                                                        |
| `assets/floor-icon-3.png`         | 16×16      | Raster "L3" chip (we cap at 3 levels for now).                           |
| `assets/keyart-clinic-tower.png`  | 1280×640   | Cutaway-style key art showing both clinic floors stacked — uses the existing `Operation Meridian Ward` mission. |

Wire-up: drop the rasters next to `runtime-atlas.png`. The stair sprite slug already
resolves through `drawGeneratedAsset("stairs", ...)` so swapping in a painted variant is
zero-code. Floor chips can replace the inline `L1`/`L2` text in `renderUnitRow` and the
`Floor X/N` text under the minimap.

## Tier 4b — Enemy / squad sprites (new AI behaviour, May 2026)

Enemies now operate in shared squads (`enemy.squadId`) with a shared alert level
(`state.enemyIntel.squadAlert[squadId]`). Sentries and Armored roles **hold their guard
tile** within a per-role leash; Rushers / Flankers / Suppressors are the movement roles
that reinforce at recent kills. Codex should account for this by giving each role a
distinct silhouette so players can read tactic-resistance and movement intent at a glance.

| Slug                              | Size      | Purpose                                                                  |
| --------------------------------- | --------- | ------------------------------------------------------------------------ |
| `assets/enemy-sentry.png`         | 38×38 x4  | Heavy plate carrier, faceplate, leashed to guard tile — feels rooted.    |
| `assets/enemy-armored.png`        | 38×38 x4  | Riot shield + heavier helmet, resists flashbangs (1.4s vs 3.3s default). |
| `assets/enemy-rusher.png`         | 38×38 x4  | Light kit, balaclava, reads as a mover that reinforces kill points.      |
| `assets/enemy-flanker.png`        | 38×38 x4  | Side-angled kit, low-vis, suggests perpendicular angles.                 |
| `assets/enemy-suppressor.png`     | 38×38 x4  | Belt-fed gunner, longer barrel, reads as a lane-control role.            |
| `assets/squad-marker.png`         | 16×16     | Optional minimap chip per squad — colour-cycled by `squadId`.            |
| `assets/reinforce-pip.png`        | 14×14     | Pulsing pip rendered at the last operator-caused kill site.              |

When delivered, swap them in via `imageAssets[`enemy_<role>`]` and add a minimap squad
colour ramp keyed off `enemy.squadId` (1..N).

## Tier 5 — Audio (out of scope for image-gen)

The game uses procedural `playTone` SFX. If audio gen is added later, target:
`assets/sfx-shot.wav`, `assets/sfx-flash.wav`, `assets/sfx-breach.wav`,
`assets/sfx-door.wav`, `assets/sfx-objective.wav`, `assets/music-loop.ogg`.

---

## Guidelines for Codex

- Use the existing colour tokens: dark teal `#0d1614`, plate `#1d2c29` / `#39524c`, accent
  yellow `#e8d270` / `#ffe98a`, friendly cyan `#62b6a6`, hostile red `#d26a5d`.
- Pixel art should snap to 1× pixel grid (no antialiasing). Render at native size, no upscale.
- Operators are tactical kit (plate carrier, helmet, sidearm visible) — pixel proportions
  more chibi than realistic (2-head tall).
- Hostiles read in red; civilians read in cyan; objectives are gold.
- Banners should leave a 32px dark gutter on the left for the campaign-card title overlay.
- Do not include real-world insignia, faces, or licensed logos.
