#!/usr/bin/env python3
"""Ensure game index.html have complete en/ja/es/fr/it hreflang (no duplicates)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

from hub_lang import HREFLANG_GAME, game_hreflang_urls

ROOT = Path(__file__).resolve().parents[1]


def game_slugs() -> list[str]:
    ja = ROOT / "ja"
    return sorted(
        p.name
        for p in ja.iterdir()
        if p.is_dir() and (ROOT / p.name).is_dir() and (ja / p.name / "index.html").is_file()
    )


def patch_file(path: Path, slug: str) -> bool:
    text = path.read_text(encoding="utf-8")
    urls = game_hreflang_urls(slug)
    links = HREFLANG_GAME.format(**urls)
    stripped = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*"[^>]*>\s*', "\n", text)
    if "<head>" not in stripped:
        return False
    if links.strip() in stripped and 'hreflang="it"' in stripped:
        return False
    stripped = stripped.replace("<head>", f"<head>\n{links}", 1)
    path.write_text(stripped, encoding="utf-8")
    return True


def main() -> None:
    bases = [ROOT, ROOT / "ja", ROOT / "es", ROOT / "fr", ROOT / "it"]
    n = 0
    for slug in game_slugs():
        for base in bases:
            p = base / slug / "index.html"
            if p.is_file() and patch_file(p, slug):
                n += 1
    print(f"patched {n} index.html files")


if __name__ == "__main__":
    main()
