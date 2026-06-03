#!/usr/bin/env python3
"""Regenerate sitemap.xml with en/ja/es/fr/it hreflang for hub and all games."""
from __future__ import annotations

from pathlib import Path

from hub_lang import SITE, game_hreflang_urls

ROOT = Path(__file__).resolve().parents[1]
LASTMOD = "2026-05-28T00:00:00+00:00"


def game_slugs() -> list[str]:
    ja = ROOT / "ja"
    return sorted(
        p.name
        for p in ja.iterdir()
        if p.is_dir() and (ROOT / p.name).is_dir()
    )


def hreflang(urls: dict[str, str]) -> str:
    return (
        f'        <xhtml:link rel="alternate" hreflang="en" href="{urls["en"]}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="ja" href="{urls["ja"]}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="es" href="{urls["es"]}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="fr" href="{urls["fr"]}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="it" href="{urls["it"]}"/>\n'
        f'        <xhtml:link rel="alternate" hreflang="x-default" href="{urls["en"]}"/>'
    )


def entry(loc: str, urls: dict[str, str], priority: str, changefreq: str) -> str:
    return f"""    <url>
        <loc>{loc}</loc>
{hreflang(urls)}
        <lastmod>{LASTMOD}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>"""


def main() -> None:
    slugs = game_slugs()
    hub_urls = {
        "en": f"{SITE}/",
        "ja": f"{SITE}/ja/",
        "es": f"{SITE}/es/",
        "fr": f"{SITE}/fr/",
        "it": f"{SITE}/it/",
    }
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for loc, pri, freq in [
        (hub_urls["en"], "1.0", "weekly"),
        (hub_urls["ja"], "0.95", "weekly"),
        (hub_urls["es"], "0.95", "weekly"),
        (hub_urls["fr"], "0.95", "weekly"),
        (hub_urls["it"], "0.95", "weekly"),
    ]:
        parts.append(entry(loc, hub_urls, pri, freq))

    for slug in slugs:
        urls = game_hreflang_urls(slug)
        for loc in urls.values():
            parts.append(entry(loc, urls, "0.9", "monthly"))

    parts.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(parts) + "\n", encoding="utf-8")
    n = 5 + len(slugs) * 5
    print(f"wrote {n} urls to sitemap.xml")


if __name__ == "__main__":
    main()
