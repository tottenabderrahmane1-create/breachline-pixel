#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SRC = ASSETS / "imagegen-campaign-armory-sheet.png"

MISSIONS = [
    "training-block",
    "catacomb",
    "embassy-annex",
    "market-rescue",
    "greenroom",
    "yardline",
    "server-vault",
    "steelhouse",
    "cargo-hold",
    "metro-switch",
    "clinic-tower",
    "night-depot",
    "castiron",
    "vantage-point",
    "penthouse",
    "rowhouse",
]

WEAPONS = [
    "m4a1",
    "hk416",
    "mp5a5",
    "mp7",
    "ak74m",
    "benelli-m4",
    "m110-sass",
    "glock17",
    "m249-saw",
]


def crop_fit(image, box, size):
    return ImageOps.fit(image.crop(tuple(map(int, box))), size, method=Image.Resampling.LANCZOS)


def main():
    if not SRC.exists():
        raise SystemExit(f"missing source sheet: {SRC}")
    image = Image.open(SRC).convert("RGBA")
    width, height = image.size

    # These positions are normalized from the generated master sheet so future
    # square regenerations can be packed again without hand-editing each file.
    thumb_x0 = 0.0096 * width
    thumb_y0 = 0.0335 * height
    thumb_w = 0.2344 * width
    thumb_h = 0.1244 * height
    thumb_step_x = 0.2448 * width
    thumb_step_y = 0.1699 * height

    for index, slug in enumerate(MISSIONS):
        col = index % 4
        row = index // 4
        left = thumb_x0 + col * thumb_step_x
        top = thumb_y0 + row * thumb_step_y
        crop = crop_fit(image, (left, top, left + thumb_w, top + thumb_h), (384, 216))
        crop.save(ASSETS / f"mission-{slug}.png")

    weapon_w = 0.1252 * width
    weapon_h = 0.0917 * height
    weapon_x0 = 0.0096 * width
    weapon_y0 = 0.8054 * height
    weapon_step = (width - 2 * weapon_x0 - weapon_w) / 8

    for index, slug in enumerate(WEAPONS):
        left = weapon_x0 + index * weapon_step
        top = weapon_y0
        crop = crop_fit(image, (left, top, left + weapon_w, top + weapon_h), (256, 128))
        crop.save(ASSETS / f"weapon-{slug}.png")

    print(f"packed {len(MISSIONS)} mission thumbnails and {len(WEAPONS)} weapon icons")


if __name__ == "__main__":
    main()
