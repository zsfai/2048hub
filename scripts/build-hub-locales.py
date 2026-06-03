#!/usr/bin/env python3
"""Build es/ and fr/ hub pages (index.html, script.js) from English hub."""
from __future__ import annotations
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://2048hub.com"

HREFLANG_HEAD = """    <link rel="alternate" hreflang="en" href="{en}">
    <link rel="alternate" hreflang="ja" href="{ja}">
    <link rel="alternate" hreflang="es" href="{es}">
    <link rel="alternate" hreflang="fr" href="{fr}">
    <link rel="alternate" hreflang="x-default" href="{en}">"""

LANG_NAV = {
    "es": """            <nav class="lang-switch lang-switch--header lang-switch--quad" aria-label="Idioma">
                <a href="https://2048hub.com/" class="lang-switch__option" hreflang="en" lang="en"><span class="lang-switch__flag" aria-hidden="true">🇺🇸</span><span>EN</span></a>
                <a href="https://2048hub.com/ja/" class="lang-switch__option" hreflang="ja" lang="ja"><span class="lang-switch__flag" aria-hidden="true">🇯🇵</span><span>JA</span></a>
                <a href="https://2048hub.com/es/" class="lang-switch__option is-active" hreflang="es" lang="es" aria-current="page"><span class="lang-switch__flag" aria-hidden="true">🇪🇸</span><span>ES</span></a>
                <a href="https://2048hub.com/fr/" class="lang-switch__option" hreflang="fr" lang="fr"><span class="lang-switch__flag" aria-hidden="true">🇫🇷</span><span>FR</span></a>
            </nav>""",
    "fr": """            <nav class="lang-switch lang-switch--header lang-switch--quad" aria-label="Langue">
                <a href="https://2048hub.com/" class="lang-switch__option" hreflang="en" lang="en"><span class="lang-switch__flag" aria-hidden="true">🇺🇸</span><span>EN</span></a>
                <a href="https://2048hub.com/ja/" class="lang-switch__option" hreflang="ja" lang="ja"><span class="lang-switch__flag" aria-hidden="true">🇯🇵</span><span>JA</span></a>
                <a href="https://2048hub.com/es/" class="lang-switch__option" hreflang="es" lang="es"><span class="lang-switch__flag" aria-hidden="true">🇪🇸</span><span>ES</span></a>
                <a href="https://2048hub.com/fr/" class="lang-switch__option is-active" hreflang="fr" lang="fr" aria-current="page"><span class="lang-switch__flag" aria-hidden="true">🇫🇷</span><span>FR</span></a>
            </nav>""",
}

LANG_SIDEBAR = {
    "es": LANG_NAV["es"].replace("lang-switch--header", "lang-switch--sidebar"),
    "fr": LANG_NAV["fr"].replace("lang-switch--header", "lang-switch--sidebar"),
}

META = {
    "es": {
        "lang": "es",
        "path": "/es/",
        "title": "2048 Hub - Juega 2048 gratis en línea",
        "desc": "Juega variantes populares de 2048 gratis en 2048 Hub: cupcakes, hex, clásico y más. Sin descargas, en el navegador.",
        "og_title": "2048 Hub - Colección de juegos 2048 gratis",
        "og_desc": "Juegos 2048 populares gratis en línea. Sin descargas.",
        "tagline": "Juega 2048 en línea",
        "menu": "Elige un juego",
        "home": "Inicio",
        "select": "Elige un juego",
        "welcome_h2": "Colección de juegos 2048",
        "welcome_p": "Elige tu variante favorita de 2048 y juega al instante",
        "feat1": "Juego instantáneo",
        "feat2": "Muchas variantes",
        "feat3": "Multiplataforma",
        "guide_h2": "Guía y consejos 2048",
        "guide_p": "Todo lo que necesitas saber sobre el 2048",
        "faq1": "¿Cómo ganar en 2048?",
        "quick": "Acceso rápido",
        "footer1": "© 2048 Hub - Todos los derechos reservados.",
        "footer2": "¡Los mejores puzzles gratis en línea!",
        "guide_footer": "¿Listo para practicar? <strong>¡Elige un juego en el menú y empieza!</strong>",
        "new_badge": "NUEVO",
    },
    "fr": {
        "lang": "fr",
        "path": "/fr/",
        "title": "2048 Hub - Jouez au 2048 gratuit en ligne",
        "desc": "Jouez aux variantes 2048 populaires gratuitement sur 2048 Hub : cupcakes, hex, classique et plus. Sans téléchargement.",
        "og_title": "2048 Hub - Collection de jeux 2048 gratuits",
        "og_desc": "Jeux 2048 populaires gratuits en ligne. Sans téléchargement.",
        "tagline": "Jouez au 2048 en ligne",
        "menu": "Choisir un jeu",
        "home": "Accueil",
        "select": "Choisir un jeu",
        "welcome_h2": "Collection de jeux 2048",
        "welcome_p": "Choisissez votre variante 2048 préférée et jouez tout de suite",
        "feat1": "Jeu instantané",
        "feat2": "Nombreuses variantes",
        "feat3": "Multiplateforme",
        "guide_h2": "Guide et astuces 2048",
        "guide_p": "Tout savoir sur le jeu 2048",
        "faq1": "Comment gagner au 2048 ?",
        "quick": "Accès rapide",
        "footer1": "© 2048 Hub - Tous droits réservés.",
        "footer2": "Les meilleurs puzzles gratuits en ligne !",
        "guide_footer": "Prêt à vous entraîner ? <strong>Choisissez un jeu dans le menu !</strong>",
        "new_badge": "NOUVEAU",
    },
}

SCRIPT_GAMES_ES = """        title: '2048 Clásico',
        description: 'El 2048 original, fácil para principiantes',
        icon: '🔢',
        url: 'https://2048hub.com/es/classic-2048/',
"""
# Use simpler approach: copy script.js and replace url base + titles via dict in script

SCRIPT_REPL_ES = [
    ("title: 'Classic 2048'", "title: '2048 Clásico'"),
    ("description: 'Original 2048 game, simple and easy to learn for beginners'",
     "description: 'El 2048 original, fácil para principiantes'"),
    ("title: '2048 Cupcakes'", "title: '2048 Cupcakes'"),
    ("description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages'",
     "description: '2048 con cupcakes adorables'"),
    ("title: '2048 Cupcakes Christmas'", "title: '2048 Cupcakes Navidad'"),
    ("description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages'",
     "description: 'Cupcakes navideños en 2048'"),
    ("title: '2048 Princess'", "title: '2048 Princess'"),
    ("description: 'Merge tiles to reveal Disney princesses in a rose pink theme'",
     "description: 'Fusiona fichas y descubre princesas Disney'"),
    ("title: '2048 Cats'", "title: '2048 Cats'"),
    ("description: 'Merge cats by nobility from alley kitten to Royal Cat'",
     "description: 'Gatos por nobleza hasta el Gato Real'"),
    ("title: '2048 Minecraft'", "title: '2048 Minecraft'"),
    ("description: 'Combine Minecraft blocks in this themed 2048 game to reach 2048'",
     "description: 'Bloques Minecraft hasta 2048'"),
    ("title: 'Couch 2048'", "title: 'Couch 2048'"),
    ("description: 'Couch 2048 game with couch theme, perfect for all ages'",
     "description: '2048 relajado con piezas arrastrables'"),
    ("title: 'Card 2048'", "title: 'Card 2048'"),
    ("description: 'Card 2048 game with card numbers, perfect for all ages'",
     "description: '2048 con cartas de póker'"),
    ("title: '2048 BYD Cars'", "title: '2048 BYD Cars'"),
    ("description: '2048 Cars Game with BYD Cars theme, perfect for all ages'",
     "description: 'Coches BYD en 2048'"),
    ("title: 'Flappy 2048'", "title: 'Flappy 2048'"),
    ("description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles'",
     "description: 'Flappy Bird y 2048 juntos'"),
    ("title: 'Doge 2048'", "title: 'Doge 2048'"),
    ("description: 'Doge 2048 game with Doge meme tiles, perfect for all ages'",
     "description: 'Memes Doge en 2048'"),
    ("title: '2048 Remastered'", "title: '2048 Remastered'"),
    ("description: '2048 Remastered game with 2048 theme, perfect for all ages'",
     "description: '2048 remasterizado con mejor gráfica'"),
    ("title: 'Hex 2048'", "title: 'Hex 2048'"),
    ("description: 'Hexagonal grid 2048 variant with more strategic gameplay'",
     "description: '2048 en cuadrícula hexagonal'"),
    ("'<span class=\"new-badge\">NEW</span>'", "'<span class=\"new-badge\">NUEVO</span>'"),
    ("backBtn.textContent = 'Home'", "backBtn.textContent = 'Inicio'"),
    ('id="backBtn">Home</button>', 'id="backBtn">Inicio</button>'),
]

SCRIPT_REPL_FR = [
    ("title: 'Classic 2048'", "title: '2048 Classique'"),
    ("description: 'Original 2048 game, simple and easy to learn for beginners'",
     "description: 'Le 2048 original, facile pour débutants'"),
    ("title: '2048 Cupcakes Christmas'", "title: '2048 Cupcakes Noël'"),
    ("description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages'",
     "description: 'Cupcakes de Noël en 2048'"),
    ("description: 'Merge tiles to reveal Disney princesses in a rose pink theme'",
     "description: 'Fusionnez pour révéler les princesses Disney'"),
    ("description: 'Merge cats by nobility from alley kitten to Royal Cat'",
     "description: 'Chats par noblesse jusqu au Chat Royal'"),
    ("description: 'Combine Minecraft blocks in this themed 2048 game to reach 2048'",
     "description: 'Blocs Minecraft jusqu a 2048'"),
    ("description: 'Couch 2048 game with couch theme, perfect for all ages'",
     "description: '2048 relaxant par glisser-déposer'"),
    ("description: 'Card 2048 game with card numbers, perfect for all ages'",
     "description: '2048 avec cartes à jouer'"),
    ("description: '2048 Cars Game with BYD Cars theme, perfect for all ages'",
     "description: 'Voitures BYD en 2048'"),
    ("description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles'",
     "description: 'Flappy Bird rencontre 2048'"),
    ("description: 'Doge 2048 game with Doge meme tiles, perfect for all ages'",
     "description: 'Mèmes Doge en 2048'"),
    ("description: '2048 Remastered game with 2048 theme, perfect for all ages'",
     "description: '2048 remasterisé, meilleurs graphismes'"),
    ("description: 'Hexagonal grid 2048 variant with more strategic gameplay'",
     "description: '2048 sur grille hexagonale'"),
    ("'<span class=\"new-badge\">NEW</span>'", "'<span class=\"new-badge\">NOUVEAU</span>'"),
    ('id="backBtn">Home</button>', 'id="backBtn">Accueil</button>'),
]


def build_index(locale: str) -> None:
    m = META[locale]
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'lang="en"', f'lang="{m["lang"]}"', html, count=1)
    html = re.sub(r"<title>[^<]*</title>", f"<title>{m['title']}</title>", html, count=1)
    html = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{m["desc"]}">',
        html,
        count=1,
    )
    html = re.sub(r'<link rel="alternate" hreflang="[^"]*"[^>]*>\s*', "", html)
    html = re.sub(
        r'<link rel="canonical" href="[^"]*">',
        f'<link rel="canonical" href="{SITE}{m["path"]}">',
        html,
        count=1,
    )
    href = HREFLANG_HEAD.format(en=f"{SITE}/", ja=f"{SITE}/ja/", es=f"{SITE}/es/", fr=f"{SITE}/fr/")
    html = html.replace("<head>", f"<head>\n{href}", 1)
    html = re.sub(r'property="og:url" content="[^"]*"', f'property="og:url" content="{SITE}{m["path"]}"', html)
    html = re.sub(r'property="og:title" content="[^"]*"', f'property="og:title" content="{m["og_title"]}"', html)
    html = re.sub(r'property="og:description" content="[^"]*"', f'property="og:description" content="{m["og_desc"]}"', html)
    html = re.sub(r'property="twitter:url" content="[^"]*"', f'property="twitter:url" content="{SITE}{m["path"]}"', html)
    html = re.sub(r'property="twitter:title" content="[^"]*"', f'property="twitter:title" content="{m["og_title"]}"', html)
    html = re.sub(r'property="twitter:description" content="[^"]*"', f'property="twitter:description" content="{m["og_desc"]}"', html)
    html = html.replace("../favicon.svg", "../favicon.svg")
    html = html.replace('href="https://2048hub.com/" class="mobile-logo-link"', f'href="{SITE}{m["path"]}" class="mobile-logo-link"')
    html = html.replace('href="https://2048hub.com/" class="sidebar-header"', f'href="{SITE}{m["path"]}" class="sidebar-header"')
    html = re.sub(
        r'<nav class="lang-switch lang-switch--header"[^>]*>.*?</nav>',
        LANG_NAV[locale],
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<nav class="lang-switch lang-switch--sidebar"[^>]*>.*?</nav>',
        LANG_SIDEBAR[locale],
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = html.replace("<p class=\"tagline\">Play 2048 Games Online</p>", f"<p class=\"tagline\">{m['tagline']}</p>")
    html = html.replace("<h3 class=\"menu-title\">Choose Game</h3>", f"<h3 class=\"menu-title\">{m['menu']}</h3>")
    html = html.replace('id="backBtn">Home</button>', f'id="backBtn">{m["home"]}</button>')
    html = html.replace("<h2>2048 Game Collection</h2>", f"<h2>{m['welcome_h2']}</h2>")
    html = html.replace(
        "<p>Select your favorite 2048 variant and start playing instantly</p>",
        f"<p>{m['welcome_p']}</p>",
    )
    html = html.replace("<span>Instant Play</span>", f"<span>{m['feat1']}</span>")
    html = html.replace("<span>Multiple Variants</span>", f"<span>{m['feat2']}</span>")
    html = html.replace("<span>Cross Platform</span>", f"<span>{m['feat3']}</span>")
    html = html.replace("<h2>2048 Game Guide & Tips</h2>", f"<h2>{m['guide_h2']}</h2>")
    html = html.replace(
        "<p>Everything you need to know about 2048 games</p>",
        f"<p>{m['guide_p']}</p>",
    )
    html = html.replace(
        "<h3 class=\"faq-question\">How to Win in 2048 Game?</h3>",
        f"<h3 class=\"faq-question\">{m['faq1']}</h3>",
    )
    html = html.replace(
        "<h3 class=\"quick-links-title\">🎯 Quick Game Access</h3>",
        f"<h3 class=\"quick-links-title\">🎯 {m['quick']}</h3>",
    )
    html = html.replace(
        "<p>&copy; 2048 Hub - All rights reserved.</p>",
        f"<p>{m['footer1']}</p>",
    )
    html = html.replace(
        "<p>Play the best puzzle games online for free!</p>",
        f"<p>{m['footer2']}</p>",
    )
    html = re.sub(
        r'Ready to put these tips into practice\? <strong>Choose a game from the menu above and start playing!</strong>',
        m["guide_footer"],
        html,
        count=1,
    )
    # Locale-prefixed game quick links only (not /ja/, /es/, /fr/ hub URLs)
    html = re.sub(
        r'href="https://2048hub.com/(?!(?:ja|es|fr)/)([^"/]+)/"',
        rf'href="{SITE}/{locale}/\1/"',
        html,
    )
    html = re.sub(
        r'<nav class="footer-lang" aria-label="Language">.*?</nav>',
        f'<nav class="footer-lang" aria-label="Language"><div class="lang-switch lang-switch--quad">{_footer_lang(locale)}</div></nav>',
        html,
        count=1,
        flags=re.DOTALL,
    )
    (ROOT / locale / "index.html").write_text(html, encoding="utf-8")


def _footer_lang(locale: str) -> str:
    active = locale
    parts = []
    for code, flag, label, path in [
        ("en", "🇺🇸", "EN", "/"),
        ("ja", "🇯🇵", "JA", "/ja/"),
        ("es", "🇪🇸", "ES", "/es/"),
        ("fr", "🇫🇷", "FR", "/fr/"),
    ]:
        cls = "lang-switch__option is-active" if code == active else "lang-switch__option"
        cur = ' aria-current="page"' if code == active else ""
        parts.append(
            f'<a href="{SITE}{path}" class="{cls}" hreflang="{code}" lang="{code}"{cur}>'
            f'<span class="lang-switch__flag" aria-hidden="true">{flag}</span><span>{label}</span></a>'
        )
    return "".join(parts)


def build_script(locale: str) -> None:
    text = (ROOT / "script.js").read_text(encoding="utf-8")
    repl = SCRIPT_REPL_ES if locale == "es" else SCRIPT_REPL_FR
    for old, new in repl:
        text = text.replace(old, new)
    # Point all game iframe URLs to locale folder
    text = re.sub(
        r"url: 'https://2048hub\.com/(?!(?:ja|es|fr)/)([^']+)/'",
        rf"url: '{SITE}/{locale}/\1/'",
        text,
    )
    (ROOT / locale / "script.js").write_text(text, encoding="utf-8")


def main() -> None:
    for loc in ("es", "fr"):
        d = ROOT / loc
        d.mkdir(exist_ok=True)
        shutil.copy2(ROOT / "styles.css", d / "styles.css")
        if (ROOT / "manifest.json").is_file():
            shutil.copy2(ROOT / "manifest.json", d / "manifest.json")
        if (ROOT / "favicon.svg").is_file():
            shutil.copy2(ROOT / "favicon.svg", d / "favicon.svg")
        build_index(loc)
        build_script(loc)
        print(f"hub {loc}/ ok")


if __name__ == "__main__":
    main()
