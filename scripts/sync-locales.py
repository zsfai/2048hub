#!/usr/bin/env python3
"""Copy games to es/ and fr/ and apply Spanish/French UI + SEO (mirrors ja/ workflow)."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://2048hub.com"
LOCALES = ("es", "fr")

# All game folders under ja/ (hub copies)
def game_slugs() -> list[str]:
    ja = ROOT / "ja"
    return sorted(
        p.name
        for p in ja.iterdir()
        if p.is_dir() and (ROOT / p.name).is_dir()
    )

GAME_META_ES: dict[str, tuple[str, str]] = {
    "classic-2048": (
        "2048 Clásico - Puzzle gratis | 2048 Hub",
        "Juega al 2048 clásico gratis en línea. Combina números hasta la ficha 2048. Sin descargas.",
    ),
    "byd-cars": (
        "2048 BYD Cars - Puzzle gratis | 2048 Hub",
        "2048 con coches BYD. Combina modelos iguales y alcanza tu puntuación máxima.",
    ),
    "2048-cupcakes": (
        "2048 Cupcakes - Puzzle gratis | 2048 Hub",
        "2048 de cupcakes: combina dulces iguales en este puzzle adorable.",
    ),
    "2048cupcakes-christmas": (
        "2048 Cupcakes Navidad | 2048 Hub",
        "Cupcakes navideños en 2048. ¡Juega gratis en el navegador!",
    ),
    "2048-remastered": (
        "2048 Remastered - Puzzle gratis | 2048 Hub",
        "2048 remasterizado con gráficos mejorados. Juego gratis en línea.",
    ),
    "couch-2048": (
        "Couch 2048 - Puzzle gratis | 2048 Hub",
        "Couch 2048: arrastra piezas y combínalas hasta el 2048.",
    ),
    "doge-2048": (
        "Doge 2048 - Puzzle gratis | 2048 Hub",
        "2048 con memes Doge. Combina fichas y sube de nivel.",
    ),
    "card-2048": (
        "Card 2048 - Puzzle gratis | 2048 Hub",
        "2048 con cartas. Combina números de póker en este puzzle.",
    ),
    "hex-2048": (
        "Hex 2048 - Puzzle gratis | 2048 Hub",
        "2048 en cuadrícula hexagonal. Estrategia y combinaciones.",
    ),
    "schulte-grid": (
        "Cuadrícula Schulte - Entrenamiento | 2048 Hub",
        "Cuadrícula Schulte gratis: toca los números del 1 al final.",
    ),
    "astro-math": (
        "Astro Math - Matemáticas espaciales | 2048 Hub",
        "Puzzle matemático espacial gratis. Resuelve y destruye asteroides.",
    ),
    "taylor-swift-2048": (
        "Taylor Swift 2048 - Puzzle gratis | 2048 Hub",
        "2048 temático de Taylor Swift. Juega gratis en línea.",
    ),
    "2048-princess": (
        "2048 Princess - Puzzle gratis | 2048 Hub",
        "2048 con princesas Disney. Combina fichas en tema rosa.",
    ),
    "2048-cats": (
        "2048 Cats - Puzzle gratis | 2048 Hub",
        "2048 con gatos por nobleza. ¡Llega al Gato Real!",
    ),
    "2048-minecraft": (
        "2048 Minecraft - Puzzle gratis | 2048 Hub",
        "2048 con bloques Minecraft. Combina hasta 2048.",
    ),
    "flappy-2048": (
        "Flappy 2048 - Puzzle gratis | 2048 Hub",
        "Flappy Bird y 2048 juntos. Vuela y combina fichas.",
    ),
    "parity": (
        "Parity - Puzzle de números | 2048 Hub",
        "Puzzle en blanco y negro: invierte números para resolver.",
    ),
    "xx142-b2exe": (
        "xx142-b2.exe - Puzzle hacker | 2048 Hub",
        "Puzzle estilo terminal. Infíltrate y desactiva el núcleo.",
    ),
    "blackholesquare": (
        "Black Hole Square - Puzzle espacial | 2048 Hub",
        "Puzzle espacial con agujeros negros. Juega gratis.",
    ),
    "breakout": (
        "Breakout - Arcade clásico | 2048 Hub",
        "Breakout gratis: rompe ladrillos con la pelota.",
    ),
    "captaincallisto": (
        "Captain Callisto - Aventura espacial | 2048 Hub",
        "Aventura espacial arcade gratis en el navegador.",
    ),
    "chromedino": (
        "Chrome Dino - Corredor infinito | 2048 Hub",
        "El dinosaurio de Chrome. Salta obstáculos sin descargar.",
    ),
    "geometrydash": (
        "Geometry Dash - Ritmo y plataformas | 2048 Hub",
        "Plataformas rítmicas. Supera niveles al ritmo de la música.",
    ),
    "8-puzzle": (
        "8 Puzzle - Puzzle deslizante | 2048 Hub",
        "Puzzle 8 clásico: ordena las fichas deslizantes.",
    ),
}

GAME_META_FR: dict[str, tuple[str, str]] = {
    "classic-2048": (
        "2048 Classique - Puzzle gratuit | 2048 Hub",
        "Jouez au 2048 classique gratuit en ligne. Fusionnez les tuiles jusqu'à 2048.",
    ),
    "byd-cars": (
        "2048 BYD Cars - Puzzle gratuit | 2048 Hub",
        "2048 avec voitures BYD. Fusionnez les modèles identiques.",
    ),
    "2048-cupcakes": (
        "2048 Cupcakes - Puzzle gratuit | 2048 Hub",
        "2048 cupcakes : fusionnez les gâteaux identiques.",
    ),
    "2048cupcakes-christmas": (
        "2048 Cupcakes Noël | 2048 Hub",
        "Cupcakes de Noël en 2048. Jouez gratuitement dans le navigateur.",
    ),
    "2048-remastered": (
        "2048 Remastered - Puzzle gratuit | 2048 Hub",
        "2048 remasterisé avec de meilleurs graphismes.",
    ),
    "couch-2048": (
        "Couch 2048 - Puzzle gratuit | 2048 Hub",
        "Couch 2048 : glissez et fusionnez jusqu'à 2048.",
    ),
    "doge-2048": (
        "Doge 2048 - Puzzle gratuit | 2048 Hub",
        "2048 avec memes Doge. Fusionnez les tuiles.",
    ),
    "card-2048": (
        "Card 2048 - Puzzle gratuit | 2048 Hub",
        "2048 avec cartes à jouer. Fusionnez les valeurs.",
    ),
    "hex-2048": (
        "Hex 2048 - Puzzle gratuit | 2048 Hub",
        "2048 sur grille hexagonale. Jeu stratégique gratuit.",
    ),
    "schulte-grid": (
        "Grille Schulte - Entraînement | 2048 Hub",
        "Grille Schulte gratuite : touchez les nombres dans l'ordre.",
    ),
    "astro-math": (
        "Astro Math - Maths spatiales | 2048 Hub",
        "Puzzle mathématique spatial gratuit.",
    ),
    "taylor-swift-2048": (
        "Taylor Swift 2048 - Puzzle gratuit | 2048 Hub",
        "2048 thème Taylor Swift. Jouez gratuitement en ligne.",
    ),
    "2048-princess": (
        "2048 Princess - Puzzle gratuit | 2048 Hub",
        "2048 princesses Disney. Fusionnez les tuiles roses.",
    ),
    "2048-cats": (
        "2048 Cats - Puzzle gratuit | 2048 Hub",
        "2048 avec chats par noblesse. Atteignez le Chat Royal !",
    ),
    "2048-minecraft": (
        "2048 Minecraft - Puzzle gratuit | 2048 Hub",
        "2048 blocs Minecraft. Fusionnez jusqu'à 2048.",
    ),
    "flappy-2048": (
        "Flappy 2048 - Puzzle gratuit | 2048 Hub",
        "Flappy Bird rencontre 2048. Volez et fusionnez.",
    ),
    "parity": (
        "Parity - Puzzle de nombres | 2048 Hub",
        "Puzzle noir et blanc : retournez les nombres.",
    ),
    "xx142-b2exe": (
        "xx142-b2.exe - Puzzle hacker | 2048 Hub",
        "Puzzle style terminal. Infiltrez le réseau alien.",
    ),
    "blackholesquare": (
        "Black Hole Square - Puzzle spatial | 2048 Hub",
        "Puzzle spatial avec trous noirs. Gratuit en ligne.",
    ),
    "breakout": (
        "Breakout - Arcade classique | 2048 Hub",
        "Breakout gratuit : cassez les briques.",
    ),
    "captaincallisto": (
        "Captain Callisto - Aventure spatiale | 2048 Hub",
        "Aventure spatiale arcade gratuite.",
    ),
    "chromedino": (
        "Chrome Dino - Course infinie | 2048 Hub",
        "Le dinosaure Chrome. Sautez les cactus.",
    ),
    "geometrydash": (
        "Geometry Dash - Plateforme rythmique | 2048 Hub",
        "Plateforme au rythme de la musique.",
    ),
    "8-puzzle": (
        "8 Puzzle - Puzzle coulissant | 2048 Hub",
        "Puzzle 8 classique : rangez les tuiles.",
    ),
}

LOCALE_INTRO = {
    "es": {
        "byd-cars": "¡Combina coches BYD y crea tu <strong>auto soñado</strong>!",
        "2048-cupcakes": "¡Únete a los <strong>cupcakes</strong>!",
        "2048cupcakes-christmas": "¡Combina <strong>cupcakes navideños</strong>!",
        "default": "¡Fusiona las <strong>fichas</strong>!",
    },
    "fr": {
        "byd-cars": "Fusionnez les BYD et créez votre <strong>voiture de rêve</strong> !",
        "2048-cupcakes": "Rejoignez les <strong>cupcakes</strong> !",
        "2048cupcakes-christmas": "Fusionnez les <strong>cupcakes de Noël</strong> !",
        "default": "Fusionnez les <strong>tuiles</strong> !",
    },
}

EXPLANATION = {
    "es": (
        '<strong class=\\"important\\">Cómo jugar:</strong> '
        'Usa las <strong>flechas</strong> para mover las fichas. '
        'Si dos fichas iguales se tocan, <strong>¡se fusionan!</strong>'
    ),
    "fr": (
        '<strong class=\\"important\\">Comment jouer :</strong> '
        'Utilisez les <strong>flèches</strong> pour déplacer les tuiles. '
        'Deux tuiles identiques <strong>fusionnent</strong> au contact !'
    ),
}

COMMON_REPLACEMENTS = {
    "es": [
        ("Join the numbers and get to the <strong>2048 tile!</strong>",
         "¡Combina números y llega a la <strong>ficha 2048</strong>!"),
        ("Join the numbers to find the <strong>last Disney princess!</strong>",
         "¡Combina números y encuentra la <strong>última princesa Disney</strong>!"),
        ("Merge cats by nobility to reach the <strong>Royal Cat!</strong>",
         "¡Combina gatos por nobleza y alcanza el <strong>Gato Real</strong>!"),
        ("Merge BYD cars and create your <strong>Dream Car!</strong>",
         "¡Combina coches BYD y crea tu <strong>auto soñado</strong>!"),
        ("Join the <strong>Cupcakes!</strong>", "¡Únete a los <strong>cupcakes</strong>!"),
        ("New Game", "Nueva partida"),
        ("Play Again", "Jugar de nuevo"),
        ("Keep going", "Seguir"),
        ("Try again", "Reintentar"),
        ("Retry", "Reintentar"),
        ('content: "Score"', 'content: "Puntos"'),
        ('content: "Best"', 'content: "Récord"'),
        ("You win!", "¡Ganaste!"),
        ("Game over!", "¡Fin del juego!"),
        ("All hail the Royal Cat!", "¡Larga vida al Gato Real!"),
        ("Hex 2048", "Hex 2048"),
        ("Merge the numbers and reach", "Combina números y alcanza"),
        (" or even ", " o incluso "),
        ("<h1>Schulte Grid</h1>", "<h1>Cuadrícula Schulte</h1>"),
        ("Mental Training Game - Click the numbers in order starting from 1 to the last number.",
         "Entrenamiento mental: toca los números del 1 al final en orden."),
        ("Select Grid Size:", "Tamaño de cuadrícula:"),
        ("3x3 (Easy)", "3×3 (Fácil)"),
        ("4x4 (Medium)", "4×4 (Medio)"),
        ("5x5 (Hard)", "5×5 (Difícil)"),
        ("6x6 (Expert)", "6×6 (Experto)"),
        ("7x7 (Master)", "7×7 (Maestro)"),
        ("Game Complete!", "¡Completado!"),
        ("WELL DONE!", "¡BIEN HECHO!"),
        ("Restart", "Reiniciar"),
        ("Next Level", "Siguiente nivel"),
        ("Start Game", "Empezar"),
        ("Play Game", "Jugar"),
        ("Use your arrow keys or swipe to combine similar Doges and score points! ",
         "¡Usa flechas o desliza para combinar Doges iguales y sumar puntos! "),
        ("Unlock all 11 doges to win!", "¡Desbloquea los 11 doges para ganar!"),
        ("When two tiles with the same cat rank touch, they <strong>merge into one!</strong>",
         "Si dos gatos del mismo rango se tocan, <strong>¡se fusionan!</strong>"),
    ],
    "fr": [
        ("Join the numbers and get to the <strong>2048 tile!</strong>",
         "Fusionnez les nombres pour atteindre la <strong>tuile 2048</strong> !"),
        ("Join the numbers to find the <strong>last Disney princess!</strong>",
         "Fusionnez pour trouver la <strong>dernière princesse Disney</strong> !"),
        ("Merge cats by nobility to reach the <strong>Royal Cat!</strong>",
         "Fusionnez les chats par noblesse pour atteindre le <strong>Chat Royal</strong> !"),
        ("Merge BYD cars and create your <strong>Dream Car!</strong>",
         "Fusionnez les BYD et créez votre <strong>voiture de rêve</strong> !"),
        ("Join the <strong>Cupcakes!</strong>", "Rejoignez les <strong>cupcakes</strong> !"),
        ("New Game", "Nouvelle partie"),
        ("Play Again", "Rejouer"),
        ("Keep going", "Continuer"),
        ("Try again", "Réessayer"),
        ("Retry", "Réessayer"),
        ('content: "Score"', 'content: "Score"'),
        ('content: "Best"', 'content: "Meilleur"'),
        ("You win!", "Victoire !"),
        ("Game over!", "Partie terminée !"),
        ("All hail the Royal Cat!", "Vive le Chat Royal !"),
        ("Merge the numbers and reach", "Fusionnez les nombres et atteignez"),
        (" or even ", " ou même "),
        ("<h1>Schulte Grid</h1>", "<h1>Grille Schulte</h1>"),
        ("Mental Training Game - Click the numbers in order starting from 1 to the last number.",
         "Entraînement : touchez les nombres de 1 à la fin dans l'ordre."),
        ("Select Grid Size:", "Taille de grille :"),
        ("3x3 (Easy)", "3×3 (Facile)"),
        ("4x4 (Medium)", "4×4 (Moyen)"),
        ("5x5 (Hard)", "5×5 (Difficile)"),
        ("6x6 (Expert)", "6×6 (Expert)"),
        ("7x7 (Master)", "7×7 (Maître)"),
        ("Game Complete!", "Terminé !"),
        ("WELL DONE!", "BRAVO !"),
        ("Restart", "Recommencer"),
        ("Next Level", "Niveau suivant"),
        ("Start Game", "Jouer"),
        ("Play Game", "Jouer"),
        ("Use your arrow keys or swipe to combine similar Doges and score points! ",
         "Flèches ou glisser pour fusionner les Doges identiques ! "),
        ("Unlock all 11 doges to win!", "Débloquez les 11 doges pour gagner !"),
        ("When two tiles with the same cat rank touch, they <strong>merge into one!</strong>",
         "Deux chats du même rang <strong>fusionnent</strong> au contact !"),
    ],
}

HREFLANG_LINKS = """  <link rel="alternate" hreflang="en" href="{en}">
  <link rel="alternate" hreflang="ja" href="{ja}">
  <link rel="alternate" hreflang="es" href="{es}">
  <link rel="alternate" hreflang="fr" href="{fr}">
  <link rel="alternate" hreflang="x-default" href="{en}">"""


def copy_slug(slug: str, locale: str) -> None:
    src = ROOT / slug
    dst = ROOT / locale / slug
    if not src.is_dir():
        return
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns("node_modules", ".git"))


def apply_replacements(text: str, locale: str) -> str:
    for old, new in COMMON_REPLACEMENTS[locale]:
        text = text.replace(old, new)
    return text


def patch_index_meta(html: str, slug: str, locale: str) -> str:
    meta_map = {"es": GAME_META_ES, "fr": GAME_META_FR}[locale]
    if slug not in meta_map:
        return html
    title, desc = meta_map[slug]
    canon = f"{SITE}/{locale}/{slug}/"
    en = f"{SITE}/{slug}/"
    ja = f"{SITE}/ja/{slug}/"
    es = f"{SITE}/es/{slug}/"
    fr = f"{SITE}/fr/{slug}/"

    html = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", html, count=1)
    if re.search(r'<meta name="description"', html):
        html = re.sub(
            r'<meta name="description"[^>]*>',
            f'<meta name="description" content="{desc}">',
            html,
            count=1,
        )
    html = re.sub(r'<link[^>]*hreflang="[^"]*"[^>]*>\s*', "", html)
    html = re.sub(r'<html[^>]*>', f'<html lang="{locale}">', html, count=1)
    html = re.sub(r"<html>", f'<html lang="{locale}">', html, count=1)
    if 'rel="canonical"' in html:
        html = re.sub(r'<link rel="canonical" href="[^"]*"', f'<link rel="canonical" href="{canon}"', html, count=1)
    else:
        html = html.replace("<head>", f'<head>\n  <link rel="canonical" href="{canon}">', 1)
    links = HREFLANG_LINKS.format(en=en, ja=ja, es=es, fr=fr)
    html = html.replace("<head>", f"<head>\n{links}", 1)
    html = re.sub(r'property="og:url" content="[^"]*"', f'property="og:url" content="{canon}"', html, count=1)
    html = re.sub(r'property="og:title" content="[^"]*"', f'property="og:title" content="{title}"', html, count=1)
    html = re.sub(r'property="og:description" content="[^"]*"', f'property="og:description" content="{desc}"', html, count=1)
    html = re.sub(r'name="twitter:title" content="[^"]*"', f'name="twitter:title" content="{title}"', html, count=1)
    html = re.sub(r'name="twitter:description" content="[^"]*"', f'name="twitter:description" content="{desc}"', html, count=1)
    og_locale = "es_ES" if locale == "es" else "fr_FR"
    if 'property="og:locale"' not in html:
        html = html.replace("<head>", f'<head>\n  <meta property="og:locale" content="{og_locale}">', 1)
    else:
        html = re.sub(r'property="og:locale" content="[^"]*"', f'property="og:locale" content="{og_locale}"', html, count=1)
    return html


def inject_hub_bar(html: str, title: str) -> str:
    if "hub-bar.js" in html:
        html = html.replace("../../../hub-bar.js", "../../hub-bar.js")
        return html
    tag = f'<script src="../../hub-bar.js" data-hub-title="{title}" defer></script>\n'
    if "</body>" in html:
        return html.replace("</body>", tag + "</body>", 1)
    return html


def patch_localization(path: Path, slug: str, locale: str) -> None:
    text = path.read_text(encoding="utf-8")
    intro = LOCALE_INTRO[locale].get(slug, LOCALE_INTRO[locale]["default"])
    expl = EXPLANATION[locale]

    loc_span = _find_locale_block(text, locale)
    if loc_span:
        start, end = loc_span
        block = text[start:end]
        if locale == "es" and "Cómo jugar" not in block and "How to play" in block:
            text = text[:start] + text[end:]
            loc_span = None
        elif locale == "fr" and "Comment jouer" not in block and "How to play" in block:
            text = text[:start] + text[end:]
            loc_span = None
    if not loc_span:
        en_span = _find_locale_block(text, "en")
        if not en_span:
            return
        start, end = en_span
        en_block = text[start:end]
        loc_block = en_block.replace('"en":', f'"{locale}":', 1)
        loc_block = _ui_patch(loc_block, locale, intro, expl)
        text = text[:end] + ",\n" + loc_block + text[end:]

    text = re.sub(r'String\.locale\s*=\s*"[^"]+"', f'String.locale = "{locale}"', text)
    text = re.sub(r'String\.defaultLocale\s*=\s*"[^"]+"', f'String.defaultLocale = "{locale}"', text)
    path.write_text(text, encoding="utf-8")


def _find_locale_block(text: str, locale: str) -> tuple[int, int] | None:
    m = re.search(rf'["\']{locale}["\']\s*:\s*\{{', text)
    if not m:
        return None
    start = m.start()
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return start, i + 1
        i += 1
    return None


def _ui_patch(block: str, locale: str, intro: str, expl: str) -> str:
    block = re.sub(
        r'"%game-intro"\s*:\s*"(?:[^"\\]|\\.)*"',
        f'"%game-intro"           : "{intro}"',
        block,
        count=1,
    )
    pairs = {
        "es": [
            ('"%restart-button"       : "New Game"', '"%restart-button"       : "Nueva partida"'),
            ('"%restart-button"       : "Play Again"', '"%restart-button"       : "Jugar de nuevo"'),
            ('"%keep-playing-button"  : "Keep going"', '"%keep-playing-button"  : "Seguir"'),
            ('"%retry-button"         : "Retry"', '"%retry-button"         : "Reintentar"'),
            ('"%game-won"             : "You win!"', '"%game-won"             : "¡Ganaste!"'),
            ('"%game-over"            : "Game over!"', '"%game-over"            : "¡Fin del juego!"'),
        ],
        "fr": [
            ('"%restart-button"       : "New Game"', '"%restart-button"       : "Nouvelle partie"'),
            ('"%restart-button"       : "Play Again"', '"%restart-button"       : "Rejouer"'),
            ('"%keep-playing-button"  : "Keep going"', '"%keep-playing-button"  : "Continuer"'),
            ('"%retry-button"         : "Retry"', '"%retry-button"         : "Réessayer"'),
            ('"%game-won"             : "You win!"', '"%game-won"             : "Victoire !"'),
            ('"%game-over"            : "Game over!"', '"%game-over"            : "Partie terminée !"'),
        ],
    }[locale]
    for o, n in pairs:
        block = block.replace(o, n)
    block = re.sub(
        r'("%game-explanation"\s*:\s*")(?:[^"\\]|\\.)*(")',
        rf"\1{expl}\2",
        block,
        count=1,
    )
    return block


def process_slug(slug: str, locale: str) -> None:
    d = ROOT / locale / slug
    if not d.is_dir():
        return
    meta_map = {"es": GAME_META_ES, "fr": GAME_META_FR}[locale]
    title = meta_map.get(slug, (slug, ""))[0].split("|")[0].strip()

    for path in d.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".js", ".css", ".htm"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        orig = text
        text = apply_replacements(text, locale)
        if path.name == "index.html":
            text = patch_index_meta(text, slug, locale)
            text = inject_hub_bar(text, title)
            path.write_text(text, encoding="utf-8")
            continue
        if path.name == "localization.js":
            patch_localization(path, slug, locale)
            continue
        text = text.replace("../../../hub-bar.js", "../../hub-bar.js")
        text = text.replace("../hub-bar.js", "../../hub-bar.js")
        text = text.replace("../../../favicon.svg", "../../favicon.svg")
        text = text.replace("../favicon.svg", "../../favicon.svg")
        text = text.replace('href="../favicon', 'href="../../favicon')
        if text != orig:
            path.write_text(text, encoding="utf-8")

    loc = d / "js" / "localization.js"
    if loc.is_file():
        patch_localization(loc, slug, locale)


def main() -> None:
    do_copy = "--copy" in sys.argv
    slugs = game_slugs()
    for locale in LOCALES:
        (ROOT / locale).mkdir(exist_ok=True)
        print(f"=== {locale} ===")
        for slug in slugs:
            if do_copy:
                copy_slug(slug, locale)
                print(f"  copied {slug}")
            process_slug(slug, locale)
    print("es/ fr/ sync complete")


if __name__ == "__main__":
    main()
