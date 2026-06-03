#!/usr/bin/env python3
"""Shared 5-language hub navigation and hreflang snippets."""
from __future__ import annotations

SITE = "https://2048hub.com"

HUB_LANGS = [
    ("en", "🇺🇸", "EN", "/"),
    ("ja", "🇯🇵", "JA", "/ja/"),
    ("es", "🇪🇸", "ES", "/es/"),
    ("fr", "🇫🇷", "FR", "/fr/"),
    ("it", "🇮🇹", "IT", "/it/"),
]

HREFLANG_HEAD = """    <link rel="alternate" hreflang="en" href="{en}">
    <link rel="alternate" hreflang="ja" href="{ja}">
    <link rel="alternate" hreflang="es" href="{es}">
    <link rel="alternate" hreflang="fr" href="{fr}">
    <link rel="alternate" hreflang="it" href="{it}">
    <link rel="alternate" hreflang="x-default" href="{en}">"""

HREFLANG_GAME = """  <link rel="alternate" hreflang="en" href="{en}">
  <link rel="alternate" hreflang="ja" href="{ja}">
  <link rel="alternate" hreflang="es" href="{es}">
  <link rel="alternate" hreflang="fr" href="{fr}">
  <link rel="alternate" hreflang="it" href="{it}">
  <link rel="alternate" hreflang="x-default" href="{en}">"""

HUB_HREFLANG_URLS = {
    "en": f"{SITE}/",
    "ja": f"{SITE}/ja/",
    "es": f"{SITE}/es/",
    "fr": f"{SITE}/fr/",
    "it": f"{SITE}/it/",
}


def game_hreflang_urls(slug: str) -> dict[str, str]:
    return {
        "en": f"{SITE}/{slug}/",
        "ja": f"{SITE}/ja/{slug}/",
        "es": f"{SITE}/es/{slug}/",
        "fr": f"{SITE}/fr/{slug}/",
        "it": f"{SITE}/it/{slug}/",
    }


def lang_nav(active: str, *, sidebar: bool = False, aria: str = "Language") -> str:
    kind = "sidebar" if sidebar else "header"
    lines = [
        f'            <nav class="lang-switch lang-switch--{kind} lang-switch--multi" aria-label="{aria}">'
    ]
    for code, flag, label, path in HUB_LANGS:
        cls = "lang-switch__option is-active" if code == active else "lang-switch__option"
        cur = ' aria-current="page"' if code == active else ""
        lines.append(
            f'                <a href="{SITE}{path}" class="{cls}" hreflang="{code}" lang="{code}"{cur}>'
            f'<span class="lang-switch__flag" aria-hidden="true">{flag}</span><span>{label}</span></a>'
        )
    lines.append("            </nav>")
    return "\n".join(lines)


def footer_lang(active: str) -> str:
    parts = []
    for code, flag, label, path in HUB_LANGS:
        cls = "lang-switch__option is-active" if code == active else "lang-switch__option"
        cur = ' aria-current="page"' if code == active else ""
        parts.append(
            f'<a href="{SITE}{path}" class="{cls}" hreflang="{code}" lang="{code}"{cur}>'
            f'<span class="lang-switch__flag" aria-hidden="true">{flag}</span><span>{label}</span></a>'
        )
    return "".join(parts)
