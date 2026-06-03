#!/usr/bin/env python3
"""Build es/, fr/, it/ hub pages and refresh 5-language nav on all hub indexes."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

from hub_guide_i18n import apply_hub_guide
from hub_lang import (
    HREFLANG_HEAD,
    HUB_HREFLANG_URLS,
    SITE,
    footer_lang,
    lang_nav,
)

ROOT = Path(__file__).resolve().parents[1]
LOCALE_EXCLUDE = r"(?:ja|es|fr|it)"

META = {
    "es": {
        "lang": "es",
        "path": "/es/",
        "aria": "Idioma",
        "title": "2048 Hub - Juega 2048 gratis en línea",
        "desc": "Juega variantes populares de 2048 gratis en 2048 Hub: cupcakes, hex, clásico y más. Sin descargas, en el navegador.",
        "og_title": "2048 Hub - Colección de juegos 2048 gratis",
        "og_desc": "Juegos 2048 populares gratis en línea. Sin descargas.",
        "tagline": "Juega 2048 en línea",
        "menu": "Elige un juego",
        "home": "Inicio",
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
    },
    "fr": {
        "lang": "fr",
        "path": "/fr/",
        "aria": "Langue",
        "title": "2048 Hub - Jouez au 2048 gratuit en ligne",
        "desc": "Jouez aux variantes 2048 populaires gratuitement sur 2048 Hub : cupcakes, hex, classique et plus. Sans téléchargement.",
        "og_title": "2048 Hub - Collection de jeux 2048 gratuits",
        "og_desc": "Jeux 2048 populaires gratuits en ligne. Sans téléchargement.",
        "tagline": "Jouez au 2048 en ligne",
        "menu": "Choisir un jeu",
        "home": "Accueil",
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
    },
    "it": {
        "lang": "it",
        "path": "/it/",
        "aria": "Lingua",
        "title": "2048 Hub - Gioca a 2048 gratis online",
        "desc": "Gioca alle varianti 2048 più popolari gratis su 2048 Hub: cupcakes, hex, classico e altro. Nessun download.",
        "og_title": "2048 Hub - Collezione giochi 2048 gratis",
        "og_desc": "Giochi 2048 popolari gratis online. Nessun download.",
        "tagline": "Gioca a 2048 online",
        "menu": "Scegli un gioco",
        "home": "Inizio",
        "welcome_h2": "Collezione giochi 2048",
        "welcome_p": "Scegli la tua variante 2048 preferita e gioca subito",
        "feat1": "Gioco istantaneo",
        "feat2": "Molte varianti",
        "feat3": "Multipiattaforma",
        "guide_h2": "Guida e consigli 2048",
        "guide_p": "Tutto quello che serve sapere sul 2048",
        "faq1": "Come vincere a 2048?",
        "quick": "Accesso rapido",
        "footer1": "© 2048 Hub - Tutti i diritti riservati.",
        "footer2": "I migliori puzzle gratis online!",
        "guide_footer": "Pronto a giocare? <strong>Scegli un gioco dal menu!</strong>",
    },
}

SCRIPT_REPL = {
    "es": [
        ("title: 'Classic 2048'", "title: '2048 Clásico'"),
        ("description: 'Original 2048 game, simple and easy to learn for beginners'",
         "description: 'El 2048 original, fácil para principiantes'"),
        ("description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages'",
         "description: '2048 con cupcakes adorables'"),
        ("title: '2048 Cupcakes Christmas'", "title: '2048 Cupcakes Navidad'"),
        ("description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages'",
         "description: 'Cupcakes navideños en 2048'"),
        ("description: 'Merge tiles to reveal Disney princesses in a rose pink theme'",
         "description: 'Fusiona fichas y descubre princesas Disney'"),
        ("description: 'Merge cats by nobility from alley kitten to Royal Cat'",
         "description: 'Gatos por nobleza hasta el Gato Real'"),
        ("description: 'Combine Minecraft blocks in this themed 2048 game to reach 2048'",
         "description: 'Bloques Minecraft hasta 2048'"),
        ("description: 'Couch 2048 game with couch theme, perfect for all ages'",
         "description: '2048 relajado con piezas arrastrables'"),
        ("description: 'Card 2048 game with card numbers, perfect for all ages'",
         "description: '2048 con cartas de póker'"),
        ("description: '2048 Cars Game with BYD Cars theme, perfect for all ages'",
         "description: 'Coches BYD en 2048'"),
        ("description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles'",
         "description: 'Flappy Bird y 2048 juntos'"),
        ("description: 'Doge 2048 game with Doge meme tiles, perfect for all ages'",
         "description: 'Memes Doge en 2048'"),
        ("description: '2048 Remastered game with 2048 theme, perfect for all ages'",
         "description: '2048 remasterizado con mejor gráfica'"),
        ("description: 'Hexagonal grid 2048 variant with more strategic gameplay'",
         "description: '2048 en cuadrícula hexagonal'"),
        ("'<span class=\"new-badge\">NEW</span>'", "'<span class=\"new-badge\">NUEVO</span>'"),
        ('id="backBtn">Home</button>', 'id="backBtn">Inicio</button>'),
        (
            "description: 'Taylor Swift 2048 game with Taylor Swift theme, perfect for all ages'",
            "description: '2048 temático de Taylor Swift, para todas las edades'",
        ),
    ],
    "fr": [
        ("title: 'Classic 2048'", "title: '2048 Classique'"),
        ("description: 'Original 2048 game, simple and easy to learn for beginners'",
         "description: 'Le 2048 original, facile pour débutants'"),
        ("title: '2048 Cupcakes Christmas'", "title: '2048 Cupcakes Noël'"),
        ("description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages'",
         "description: 'Cupcakes de Noël en 2048'"),
        ("description: 'Merge tiles to reveal Disney princesses in a rose pink theme'",
         "description: 'Fusionnez pour révéler les princesses Disney'"),
        ("description: 'Merge cats by nobility from alley kitten to Royal Cat'",
         "description: 'Chats par noblesse jusqu\\'au Chat Royal'"),
        ("description: 'Chats par noblesse jusqu au Chat Royal'",
         "description: 'Chats par noblesse jusqu\\'au Chat Royal'"),
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
        (
            "description: 'Taylor Swift 2048 game with Taylor Swift theme, perfect for all ages'",
            "description: '2048 thème Taylor Swift, pour tous les âges'",
        ),
        (
            "description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages'",
            "description: '2048 cupcakes adorables'",
        ),
    ],
    "it": [
        ("title: 'Classic 2048'", "title: '2048 Classico'"),
        ("description: 'Original 2048 game, simple and easy to learn for beginners'",
         "description: 'Il 2048 originale, facile per principianti'"),
        ("description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages'",
         "description: '2048 con cupcakes adorabili'"),
        ("title: '2048 Cupcakes Christmas'", "title: '2048 Cupcakes Natale'"),
        ("description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages'",
         "description: 'Cupcakes natalizi in 2048'"),
        ("description: 'Merge tiles to reveal Disney princesses in a rose pink theme'",
         "description: 'Unisci e scopri le principesse Disney'"),
        ("description: 'Merge cats by nobility from alley kitten to Royal Cat'",
         "description: 'Gatti per nobiltà fino al Gatto Reale'"),
        ("description: 'Gatti per nobilta fino al Gatto Reale'",
         "description: 'Gatti per nobilità fino al Gatto Reale'"),
        ("description: 'Combine Minecraft blocks in this themed 2048 game to reach 2048'",
         "description: 'Blocchi Minecraft fino al 2048'"),
        ("description: 'Couch 2048 game with couch theme, perfect for all ages'",
         "description: '2048 rilassante con tessere trascinabili'"),
        ("description: 'Card 2048 game with card numbers, perfect for all ages'",
         "description: '2048 con carte da gioco'"),
        ("description: '2048 Cars Game with BYD Cars theme, perfect for all ages'",
         "description: 'Auto BYD in 2048'"),
        ("description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles'",
         "description: 'Flappy Bird e 2048 insieme'"),
        ("description: 'Doge 2048 game with Doge meme tiles, perfect for all ages'",
         "description: 'Meme Doge in 2048'"),
        ("description: '2048 Remastered game with 2048 theme, perfect for all ages'",
         "description: '2048 remastered, grafica migliorata'"),
        ("description: 'Hexagonal grid 2048 variant with more strategic gameplay'",
         "description: '2048 su griglia esagonale'"),
        ("'<span class=\"new-badge\">NEW</span>'", "'<span class=\"new-badge\">NUOVO</span>'"),
        ('id="backBtn">Home</button>', 'id="backBtn">Inizio</button>'),
        (
            "description: 'Taylor Swift 2048 game with Taylor Swift theme, perfect for all ages'",
            "description: '2048 a tema Taylor Swift, per tutte le età'",
        ),
        (
            "description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages'",
            "description: '2048 con cupcakes adorabili'",
        ),
    ],
}


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
    html = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*"[^>]*>\s*', "\n", html)
    html = re.sub(
        r'<link rel="canonical" href="[^"]*">',
        f'<link rel="canonical" href="{SITE}{m["path"]}">',
        html,
        count=1,
    )
    href = HREFLANG_HEAD.format(**HUB_HREFLANG_URLS)
    html = html.replace("<head>", f"<head>\n{href}", 1)
    html = re.sub(r'property="og:url" content="[^"]*"', f'property="og:url" content="{SITE}{m["path"]}"', html)
    html = re.sub(r'property="og:title" content="[^"]*"', f'property="og:title" content="{m["og_title"]}"', html)
    html = re.sub(r'property="og:description" content="[^"]*"', f'property="og:description" content="{m["og_desc"]}"', html)
    html = re.sub(r'property="twitter:url" content="[^"]*"', f'property="twitter:url" content="{SITE}{m["path"]}"', html)
    html = re.sub(r'property="twitter:title" content="[^"]*"', f'property="twitter:title" content="{m["og_title"]}"', html)
    html = re.sub(r'property="twitter:description" content="[^"]*"', f'property="twitter:description" content="{m["og_desc"]}"', html)
    html = html.replace('href="https://2048hub.com/" class="mobile-logo-link"', f'href="{SITE}{m["path"]}" class="mobile-logo-link"')
    html = html.replace('href="https://2048hub.com/" class="sidebar-header"', f'href="{SITE}{m["path"]}" class="sidebar-header"')
    html = inject_lang_nav(html, locale, m["aria"])
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
    html = re.sub(
        rf'href="https://2048hub.com/(?!{LOCALE_EXCLUDE}/)([^"/]+)/"',
        rf'href="{SITE}/{locale}/\1/"',
        html,
    )
    html = apply_hub_guide(html, locale)
    (ROOT / locale / "index.html").write_text(html, encoding="utf-8")


def inject_lang_nav(html: str, active: str, aria: str) -> str:
    html = re.sub(
        r'<nav class="lang-switch lang-switch--header[^"]*"[^>]*>.*?</nav>',
        lang_nav(active, aria=aria),
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<nav class="lang-switch lang-switch--sidebar[^"]*"[^>]*>.*?</nav>',
        lang_nav(active, sidebar=True, aria=aria),
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<nav class="footer-lang"[^>]*>.*?</nav>',
        f'<nav class="footer-lang" aria-label="{aria}"><div class="lang-switch lang-switch--multi">{footer_lang(active)}</div></nav>',
        html,
        count=1,
        flags=re.DOTALL,
    )
    return html


def patch_hub(path: Path, active: str, aria: str = "Language") -> None:
    html = path.read_text(encoding="utf-8")
    html = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*"[^>]*>\s*', "\n", html)
    href = HREFLANG_HEAD.format(**HUB_HREFLANG_URLS)
    html = html.replace("<head>", f"<head>\n{href}", 1)
    html = inject_lang_nav(html, active, aria)
    path.write_text(html, encoding="utf-8")


def build_script(locale: str) -> None:
    text = (ROOT / "script.js").read_text(encoding="utf-8")
    for old, new in SCRIPT_REPL[locale]:
        text = text.replace(old, new)
    text = re.sub(
        rf"url: 'https://2048hub\.com/(?!{LOCALE_EXCLUDE}/)([^']+)/'",
        rf"url: '{SITE}/{locale}/\1/'",
        text,
    )
    (ROOT / locale / "script.js").write_text(text, encoding="utf-8")


def main() -> None:
    for loc in ("es", "fr", "it"):
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

    patch_hub(ROOT / "index.html", "en")
    patch_hub(ROOT / "ja" / "index.html", "ja", "言語")
    print("hub en/ ja/ nav updated")


if __name__ == "__main__":
    main()
