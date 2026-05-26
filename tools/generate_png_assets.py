from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MASTER_PATH = ASSETS / "imagegen-raster-master.png"
SHEET_PATH = ASSETS / "generated-ui-asset-sheet.png"

SHEET_W = 2048
SHEET_H = 1024

RECTS = {
    "logo": (0, 0, 96, 96),
    "logo_lockup": (128, 0, 640, 160),
    "home_keyart": (0, 192, 960, 540),
    "portrait_rook": (1024, 0, 96, 96),
    "portrait_mako": (1136, 0, 96, 96),
    "portrait_lynx": (1248, 0, 96, 96),
    "portrait_volt": (1360, 0, 96, 96),
    "stairs": (1024, 128, 64, 64),
    "shield": (1104, 128, 64, 64),
    "route": (1184, 128, 64, 64),
    "command": (1264, 128, 64, 64),
    "window_breach": (1344, 128, 64, 64),
    "radial_center": (1424, 128, 64, 64),
    "wall_connector": (1504, 128, 64, 64),
    "wall_single": (1024, 224, 64, 64),
    "wall_end": (1104, 224, 64, 64),
    "wall_straight": (1184, 224, 64, 64),
    "wall_corner": (1264, 224, 64, 64),
    "wall_t": (1344, 224, 64, 64),
    "wall_cross": (1424, 224, 64, 64),
}

MASTER_CROPS = {
    "logo": (36, 30, 238, 200),
    "logo_lockup": (260, 68, 785, 194),
    "home_keyart": (825, 34, 1504, 357),
    "portrait_rook": (48, 232, 222, 410),
    "portrait_mako": (238, 232, 410, 410),
    "portrait_lynx": (426, 232, 596, 410),
    "portrait_volt": (612, 232, 785, 410),
    "stairs": (45, 698, 188, 824),
    "shield": (464, 428, 582, 550),
    "route": (328, 428, 448, 550),
    "command": (606, 428, 722, 550),
    "window_breach": (208, 698, 360, 824),
    "radial_center": (320, 562, 446, 684),
    "wall_connector": (1438, 738, 1498, 818),
    "wall_single": (584, 700, 662, 816),
    "wall_end": (724, 700, 784, 816),
    "wall_straight": (724, 700, 784, 816),
    "wall_corner": (806, 698, 970, 816),
    "wall_t": (1128, 698, 1252, 818),
    "wall_cross": (1298, 698, 1402, 826),
}

INDIVIDUALS = {
    "logo": "logo.png",
    "logo_lockup": "logo-lockup.png",
    "home_keyart": "home-keyart.png",
    "portrait_rook": "op-rook-portrait.png",
    "portrait_mako": "op-mako-portrait.png",
    "portrait_lynx": "op-lynx-portrait.png",
    "portrait_volt": "op-volt-portrait.png",
    "stairs": "stairs.png",
    "shield": "shield.png",
    "route": "route.png",
    "command": "command.png",
    "window_breach": "window-breach.png",
    "radial_center": "radial-center.png",
    "wall_connector": "wall-connector.png",
    "wall_single": "wall-single.png",
    "wall_end": "wall-end.png",
    "wall_straight": "wall-straight.png",
    "wall_corner": "wall-corner.png",
    "wall_t": "wall-t.png",
    "wall_cross": "wall-cross.png",
}


def crop_master(master, name):
    return master.crop(MASTER_CROPS[name])


def color_distance(a, b):
    return sum((int(a[i]) - int(b[i])) ** 2 for i in range(3)) ** 0.5


def remove_dark_sheet_background(img, tolerance=44):
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()
    border = []
    for x in range(w):
        border.append(pixels[x, 0])
        border.append(pixels[x, h - 1])
    for y in range(h):
        border.append(pixels[0, y])
        border.append(pixels[w - 1, y])
    bg = tuple(int(sorted([p[i] for p in border])[len(border) // 2]) for i in range(3))
    seen = set()
    q = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or (x, y) in seen:
            continue
        seen.add((x, y))
        p = pixels[x, y]
        dark_blue_bg = p[2] >= p[0] and p[2] >= p[1] and max(p[:3]) < 74
        if color_distance(p, bg) > tolerance and not dark_blue_bg:
            continue
        pixels[x, y] = (p[0], p[1], p[2], 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return img


def trim_alpha(img, pad=4):
    bbox = img.getchannel("A").getbbox()
    if not bbox:
        return img
    return img.crop((
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(img.width, bbox[2] + pad),
        min(img.height, bbox[3] + pad),
    ))


def fit_image(img, size, pad=0, fill=(0, 0, 0, 0), anchor=(0.5, 0.5)):
    out = Image.new("RGBA", size, fill)
    max_w = max(1, size[0] - pad * 2)
    max_h = max(1, size[1] - pad * 2)
    scale = min(max_w / img.width, max_h / img.height)
    new_size = (max(1, round(img.width * scale)), max(1, round(img.height * scale)))
    fitted = img.resize(new_size, Image.Resampling.LANCZOS)
    x = round(pad + (max_w - new_size[0]) * anchor[0])
    y = round(pad + (max_h - new_size[1]) * anchor[1])
    out.alpha_composite(fitted, (x, y))
    return out


def sprite(master, name, size, pad=0, transparent=True, anchor=(0.5, 0.5)):
    img = crop_master(master, name)
    if transparent:
        img = trim_alpha(remove_dark_sheet_background(img), pad=2)
    return fit_image(img, size, pad=pad, anchor=anchor)


def lockup(master):
    return sprite(master, "logo_lockup", (640, 160), pad=6, transparent=True)


def home_keyart(master):
    return fit_image(crop_master(master, "home_keyart").convert("RGBA"), (960, 540), fill=(5, 10, 14, 255))


def wall_piece(master, name):
    return sprite(master, name, (64, 64), pad=0, transparent=True)


def build_sheet(master):
    sheet = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0))
    assets = {
        "logo": sprite(master, "logo", (96, 96), transparent=True),
        "logo_lockup": lockup(master),
        "home_keyart": home_keyart(master),
        "portrait_rook": sprite(master, "portrait_rook", (96, 96), pad=0, transparent=True),
        "portrait_mako": sprite(master, "portrait_mako", (96, 96), pad=0, transparent=True),
        "portrait_lynx": sprite(master, "portrait_lynx", (96, 96), pad=0, transparent=True),
        "portrait_volt": sprite(master, "portrait_volt", (96, 96), pad=0, transparent=True),
        "stairs": sprite(master, "stairs", (64, 64), transparent=True),
        "shield": sprite(master, "shield", (64, 64), transparent=True),
        "route": sprite(master, "route", (64, 64), transparent=True),
        "command": sprite(master, "command", (64, 64), transparent=True),
        "window_breach": sprite(master, "window_breach", (64, 64), transparent=True),
        "radial_center": sprite(master, "radial_center", (64, 64), transparent=True),
        "wall_connector": wall_piece(master, "wall_connector"),
        "wall_single": wall_piece(master, "wall_single"),
        "wall_end": wall_piece(master, "wall_end"),
        "wall_straight": wall_piece(master, "wall_straight"),
        "wall_corner": wall_piece(master, "wall_corner"),
        "wall_t": wall_piece(master, "wall_t"),
        "wall_cross": wall_piece(master, "wall_cross"),
    }
    for name, img in assets.items():
        x, y, w, h = RECTS[name]
        sheet.alpha_composite(img.resize((w, h), Image.Resampling.LANCZOS), (x, y))
    return sheet


def crop_rect(sheet, name):
    x, y, w, h = RECTS[name]
    return sheet.crop((x, y, x + w, y + h))


def save_individuals(sheet):
    for sprite_name, filename in INDIVIDUALS.items():
        crop_rect(sheet, sprite_name).save(ASSETS / filename)
    crop_rect(sheet, "logo").resize((64, 64), Image.Resampling.LANCZOS).save(ASSETS / "favicon.png")


def main():
    if not MASTER_PATH.exists():
        raise FileNotFoundError(f"Generate/copy the imagegen master sheet first: {MASTER_PATH}")
    master = Image.open(MASTER_PATH).convert("RGBA")
    sheet = build_sheet(master)
    sheet.save(SHEET_PATH)
    save_individuals(sheet)


if __name__ == "__main__":
    main()
