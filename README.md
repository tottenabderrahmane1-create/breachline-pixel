# Breachline Pixel

An original pixel-art, top-down tactical breach game for the browser.

## Run

```bash
cd /Users/28atotten/BreachlinePixel
npm run dev
```

Then open `http://127.0.0.1:5173`.

## What is included

- Real-time-with-pause command play
- Four operator squad with waypoint planning
- Line-of-sight combat, doors, smokes, flashbangs, breaching charges, medkits
- Generated runtime sprite atlas used directly in gameplay for units, props, effects, objectives, extraction, and UI tool icons
- Focus/overwatch orders, recon drones, hostile tagging, suppression, enemy roles, and armor/piercing interactions
- Close tactical camera, fog-of-war visibility, hidden room interiors, and operator under-fire reactions
- Campaign missions, procedural/custom content hooks, local save data
- Add-on toggles and mission JSON import/export
- Built-in editor for custom missions
- Generated pixel art: original sheet in `assets/ai-generated-pixel-asset-sheet.png` and runtime atlas in `assets/runtime-atlas.png`

## Custom mission format

Import JSON shaped like `addons/sample-custom-mission.json`.

Tile legend:

- `#` wall
- `.` floor
- `D` door
- `W` window
- `B` crate/blocking cover
- `S` operator start
- `E` hostile start
- `C` civilian
- `O` objective
- `X` extraction

The game saves progress and custom missions to browser `localStorage`.
