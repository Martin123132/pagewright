from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


def create_demo_pdf(path: Path, title: str, pages: int = 1) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.init()
    images: list[Image.Image] = []
    try:
        for page_number in range(1, pages + 1):
            image = Image.new("RGB", (900, 1200), "#fffefb")
            draw = ImageDraw.Draw(image)
            draw.rectangle((54, 54, 846, 1146), outline="#d6d9d1", width=4)
            draw.rectangle((86, 86, 814, 260), fill="#f3f5f2", outline="#d6d9d1", width=2)
            draw.text((118, 126), "Pagewright", fill="#171716")
            draw.text((118, 172), title, fill="#b83232")
            draw.text((118, 218), f"Demo page {page_number} of {pages}", fill="#363632")
            draw.line((118, 360, 782, 360), fill="#d6d9d1", width=3)
            draw.line((118, 430, 640, 430), fill="#d6d9d1", width=3)
            draw.line((118, 500, 732, 500), fill="#d6d9d1", width=3)
            images.append(image)

        first, *rest = images
        first.save(path, save_all=True, append_images=rest)
        return path
    finally:
        for image in images:
            image.close()


def create_demo_image(path: Path, title: str, fill: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (1200, 800), "#fffefb")
    try:
        draw = ImageDraw.Draw(image)
        draw.rectangle((44, 44, 1156, 756), outline="#d6d9d1", width=4)
        draw.rectangle((88, 92, 1112, 352), fill=fill)
        draw.text((118, 420), "Pagewright image demo", fill="#171716")
        draw.text((118, 472), title, fill="#363632")
        draw.line((118, 560, 880, 560), fill="#d6d9d1", width=4)
        draw.line((118, 628, 720, 628), fill="#d6d9d1", width=4)
        image.save(path)
        return path
    finally:
        image.close()
