#!/usr/bin/env python3
"""Ensure en/ja game index.html have complete en/ja/es/fr hreflang (no duplicates)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://2048hub.com"

HREFLANG = """  <link rel="alternate" hreflang="en" href="{en}">
  <link rel="alternate" hreflang="ja" href="{ja}">
  <link rel="alternate" hreflang="es" href="{es}">
  <link rel="alternate" hreflang="fr" href="{fr}">
  <link rel="alternate" hreflang="x-default" href="{en}">"""


def game_slugs() -> list[str]:
    ja = ROOT / "ja"
    return sorted(
        p.name
        for p in ja.iterdir()
        if p.is_dir() and (ROOT / p.name).is_dir() and (ja / p.name / "index.html").is_file()
    )


def patch_file(path: Path, slug: str) -> bool:
    text = path.read_text(encoding="utf-8")
    en = f"{SITE}/{slug}/"
    ja = f"{SITE}/ja/{slug}/"
    es = f"{SITE}/es/{slug}/"
    fr = f"{SITE}/fr/{slug}/"
    links = HREFLANG.format(en=en, ja=ja, es=es, fr=fr)
    stripped = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*"[^>]*>\s*', "\n", text)
    if stripped == text and links.strip() in text:
        return False
    if "<head>" not in stripped:
        return False
    stripped = stripped.replace("<head>", f"<head>\n{links}", 1)
    path.write_text(stripped, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for slug in game_slugs():
        for base in (ROOT, ROOT / "ja"):
            p = base / slug / "index.html"
            if p.is_file() and patch_file(p, slug):
                n += 1
    print(f"patched {n} index.html files")


if __name__ == "__main__":
    main()
