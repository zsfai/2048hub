#!/usr/bin/env python3
"""Download cat tile images for 2048-cats via The Cat API (thecatapi.com)."""
from __future__ import annotations
import io
import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "2048-cats" / "style"
SIZE = 220

# (filename, query params for /v1/images/search, label)
TILES = [
    ("1.png", {}, "Alley kitten"),
    ("2.png", {"limit": "1"}, "Tabby cat"),
    ("3.png", {"limit": "1"}, "House cat"),
    ("4.png", {"breed_ids": "abys", "limit": "1"}, "Abyssinian / ginger"),
    ("5.png", {"breed_ids": "siam", "limit": "1"}, "Siamese"),
    ("6.png", {"breed_ids": "rblu", "limit": "1"}, "Russian Blue"),
    ("7.png", {"breed_ids": "bsho", "limit": "1"}, "British Shorthair"),
    ("8.png", {"breed_ids": "pers", "limit": "1"}, "Persian"),
    ("9.png", {"breed_ids": "mcoo", "limit": "1"}, "Maine Coon"),
    ("10.png", {"breed_ids": "beng", "limit": "1"}, "Bengal"),
    ("11.png", {"breed_ids": "ragd", "limit": "1"}, "Royal Ragdoll"),
    ("12.png", {"breed_ids": "sfin", "limit": "1"}, "Sphynx emperor"),
]

UA = {"User-Agent": "2048hub-cats/1.0 (https://2048hub.com)"}


def api_image_url(params: dict) -> str:
    q = urllib.parse.urlencode(params)
    api = f"https://api.thecatapi.com/v1/images/search?{q}"
    req = urllib.request.Request(api, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode())
    if not data:
        raise RuntimeError(f"No image from API: {params}")
    return data[0]["url"]


def download_square(url: str, dest: Path) -> None:
    last_err = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read()
            break
        except Exception as e:
            last_err = e
            if attempt == 2:
                raise last_err
    else:
        raise last_err
    try:
        from PIL import Image

        img = Image.open(io.BytesIO(raw)).convert("RGB")
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
        img.save(dest, "PNG", optimize=True)
    except ImportError:
        dest.write_bytes(raw)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, params, label in TILES:
        dest = OUT / name
        if dest.is_file() and dest.stat().st_size > 5000:
            print(f"  skip {name} — {label}")
            continue
        if not params:
            params = {"limit": "1", "mime_types": "jpg,png"}
        elif "limit" not in params:
            params = {**params, "limit": "1"}
        url = api_image_url(params)
        download_square(url, OUT / name)
        print(f"  {name} — {label}")
    jpg = OUT / "11.jpg"
    if jpg.is_file():
        jpg.unlink()
    print("done:", OUT)


if __name__ == "__main__":
    main()
