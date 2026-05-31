#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SRC = ASSETS / "tilemap-master.png"

GRID = [
    ["tile-floor-concrete", "tile-floor-office", "tile-floor-warehouse", "tile-floor-clinic", "tile-floor-bank", "tile-floor-nightclub", "tile-floor-ship", "tile-floor-metro"],
    ["tile-floor-residential", "tile-floor-catacomb", "tile-floor-market", "tile-floor-server", "tile-floor-tunnel", "tile-floor-rooftop", "tile-floor-garage", "tile-floor-dark"],
    ["tile-wall-single", "tile-wall-vertical", "tile-wall-horizontal", "tile-wall-end", "tile-wall-corner-outer", "tile-wall-corner-inner", "tile-wall-t", "tile-wall-cross"],
    ["tile-door-wood", "tile-door-metal", "tile-door-open", "tile-door-breached", "tile-window", "tile-window-breached", "tile-stairs", "tile-wall-exterior"],
    ["prop-crate-wood", "prop-crate-metal", "prop-barrel", "prop-desk", "prop-counter", "prop-market-shelf", "prop-server-rack", "prop-hospital-bed"],
    ["prop-bar-counter", "prop-couch", "prop-bank-counter", "prop-vault-table", "prop-rail-track", "prop-train-cover", "prop-cargo-container", "prop-ship-console"],
    ["decal-lane", "decal-grime", "decal-puddle", "decal-glass", "decal-neon", "decal-cable", "prop-sandbag", "prop-laptop"],
    ["marker-extract", "prop-objective-case", "prop-medkit", "prop-drone", "vfx-smoke-puff", "vfx-flash-burst", "vfx-muzzle-flash", "prop-window-step"],
]


def crop_cell(image, row, col):
    width, height = image.size
    cell_w = width / 8
    cell_h = height / 8
    inset_x = cell_w * 0.07
    inset_y = cell_h * 0.07
    left = col * cell_w + inset_x
    top = row * cell_h + inset_y
    right = (col + 1) * cell_w - inset_x
    bottom = (row + 1) * cell_h - inset_y
    return ImageOps.fit(
        image.crop((int(left), int(top), int(right), int(bottom))),
        (64, 64),
        method=Image.Resampling.LANCZOS,
    )


def main():
    if not SRC.exists():
        raise SystemExit(f"missing source sheet: {SRC}")
    image = Image.open(SRC).convert("RGBA")
    count = 0
    for row, names in enumerate(GRID):
        for col, name in enumerate(names):
            crop_cell(image, row, col).save(ASSETS / f"{name}.png")
            count += 1
    print(f"packed {count} tilemap sprites from {SRC.name}")


if __name__ == "__main__":
    main()
