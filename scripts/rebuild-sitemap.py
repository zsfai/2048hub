#!/usr/bin/env python3
"""Regenerate sitemap.xml with en/ja/es/fr hreflang for hub and all games."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://2048hub.com"
LASTMOD_HUB = "2026-05-28T00:00:00+00:00"
LASTMOD_GAME = "2026-05-28T00:00:00+00:00"


def game_slugs() -> list[str]:
    ja = ROOT / "ja"
    return sorted(
        p.name
        for p in ja.iterdir()
        if p.is_dir() and (ROOT / p.name).is_dir()
    )


def hreflang(en: str, ja: str, es: str, fr: str) -> str:
    return (
        f'        <xhtml:link rel="alternate" hreflang="en" href="{en}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="ja" href="{ja}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="es" href="{es}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="fr" href="{fr}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="x-default" href="{en}"/>'
    )


def entry(loc: str, en: str, ja: str, es: str, fr: str, priority: str, changefreq: str, lastmod: str) -> str:
    return f"""    <url>
        <loc>{loc}</loc>
{hreflang(en, ja, es, fr)}
        <lastmod>{lastmod}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>"""


def main() -> None:
    slugs = game_slugs()
    hubs = [
        (f"{SITE}/", "1.0", "weekly", LASTMOD_HUB),
        (f"{SITE}/ja/", "0.95", "weekly", LASTMOD_HUB),
        (f"{SITE}/es/", "0.95", "weekly", LASTMOD_HUB),
        (f"{SITE}/fr/", "0.95", "weekly", LASTMOD_HUB),
    ]
    en_h, ja_h, es_h, fr_h = f"{SITE}/", f"{SITE}/ja/", f"{SITE}/es/", f"{SITE}/fr/"

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for loc, pri, freq, lm in hubs:
        parts.append(entry(loc, en_h, ja_h, es_h, fr_h, pri, freq, lm))

    for slug in slugs:
        en = f"{SITE}/{slug}/"
        ja = f"{SITE}/ja/{slug}/"
        es = f"{SITE}/es/{slug}/"
        fr = f"{SITE}/fr/{slug}/"
        for loc in (en, ja, es, fr):
            parts.append(entry(loc, en, ja, es, fr, "0.9", "monthly", LASTMOD_GAME))

    parts.append("</urlset>")
    out = ROOT / "sitemap.xml"
    out.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"wrote {len(hubs) + len(slugs) * 4} urls to sitemap.xml")


if __name__ == "__main__":
    main()
