#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


CANVAS_W = 1280
CANVAS_H = 670
SAFE_Y = 227
SAFE_H = 216


FONT_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ明朝 ProN.ttc",
    "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/Library/Fonts/Arial Unicode.ttf",
]


ACCENTS = {
    "blue": {
        "main": (13, 33, 83, 255),
        "accent": (38, 103, 180, 255),
        "body": (37, 49, 76, 255),
        "line": (84, 164, 255, 180),
    },
    "green": {
        "main": (18, 58, 55, 255),
        "accent": (36, 125, 107, 255),
        "body": (42, 70, 67, 255),
        "line": (89, 185, 157, 180),
    },
    "warm": {
        "main": (66, 45, 36, 255),
        "accent": (168, 92, 57, 255),
        "body": (83, 69, 62, 255),
        "line": (227, 145, 87, 180),
    },
}


def find_font() -> str:
    for candidate in FONT_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    raise FileNotFoundError("No suitable Japanese font found.")


FONT_PATH = find_font()


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size)


def fit_text(draw: ImageDraw.ImageDraw, text: str, max_width: int, start: int, minimum: int) -> ImageFont.FreeTypeFont:
    for size in range(start, minimum - 1, -2):
        candidate = font(size)
        bbox = draw.textbbox((0, 0), text, font=candidate)
        if bbox[2] - bbox[0] <= max_width:
            return candidate
    return font(minimum)


def cover_resize(image: Image.Image, target_w: int, target_h: int) -> Image.Image:
    width, height = image.size
    scale = max(target_w / width, target_h / height)
    resized_w = round(width * scale)
    resized_h = round(height * scale)
    image = image.resize((resized_w, resized_h), Image.Resampling.LANCZOS)
    left = (resized_w - target_w) // 2
    top = (resized_h - target_h) // 2
    return image.crop((left, top, left + target_w, top + target_h))


def compose(args: argparse.Namespace) -> None:
    background = Image.open(args.background).convert("RGB")
    canvas = cover_resize(background, CANVAS_W, CANVAS_H).convert("RGBA")

    colors = ACCENTS[args.accent]
    panel_opacity = max(0, min(255, args.panel_opacity))

    shadow = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        [76, SAFE_Y + 41, 690, SAFE_Y + SAFE_H - 25],
        radius=18,
        fill=(18, 34, 70, 25),
    )
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(16)))

    panel = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle(
        [76, SAFE_Y + 34, 690, SAFE_Y + SAFE_H - 34],
        radius=18,
        fill=(255, 255, 255, panel_opacity),
    )
    canvas = Image.alpha_composite(canvas, panel)

    draw = ImageDraw.Draw(canvas)
    x = 114

    subtitle_font = fit_text(draw, args.subtitle, 530, 27, 20)
    title_font = fit_text(draw, args.title, 560, 75, 52)
    tagline_font = fit_text(draw, args.tagline, 560, 28, 20)

    draw.text((x, SAFE_Y + 42), args.subtitle, font=subtitle_font, fill=colors["main"])
    draw.text((x + 2, SAFE_Y + 84), args.title, font=title_font, fill=(255, 255, 255, 150))
    draw.text((x, SAFE_Y + 82), args.title, font=title_font, fill=colors["main"])
    draw.line([(x + 142, SAFE_Y + 155), (x + 450, SAFE_Y + 155)], fill=colors["line"], width=2)
    draw.text((x, SAFE_Y + 174), args.tagline, font=tagline_font, fill=colors["body"])

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output, quality=96)

    with Image.open(output) as saved:
        if saved.size != (CANVAS_W, CANVAS_H):
            raise RuntimeError(f"Unexpected output size: {saved.size}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Compose a note profile header at 1280x670 with center-safe text.")
    parser.add_argument("--background", required=True, help="Path to a text-free background image.")
    parser.add_argument("--output", required=True, help="Output PNG path.")
    parser.add_argument("--title", required=True, help="Main title text.")
    parser.add_argument("--subtitle", required=True, help="Small subtitle text.")
    parser.add_argument("--tagline", required=True, help="Bottom tagline text.")
    parser.add_argument("--accent", choices=sorted(ACCENTS), default="blue")
    parser.add_argument("--panel-opacity", type=int, default=176)
    return parser.parse_args()


if __name__ == "__main__":
    compose(parse_args())
