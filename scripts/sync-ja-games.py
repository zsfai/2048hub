#!/usr/bin/env python3
"""Copy English game folders to ja/ and apply Japanese translations (no iframe stubs)."""
from __future__ import annotations
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JA = ROOT / "ja"
SITE = "https://2048hub.com"

COPY_SLUGS = [
    "classic-2048",
    "byd-cars",
    "2048-cupcakes",
    "2048cupcakes-christmas",
    "2048-remastered",
    "couch-2048",
    "doge-2048",
    "card-2048",
    "hex-2048",
    "schulte-grid",
    "astro-math",
    "taylor-swift-2048",
]

# Per-game SEO (title + description for <head> replacement)
GAME_META = {
    "classic-2048": (
        "クラシック 2048 - 無料パズル | 2048 Hub",
        "クラシック2048を無料でオンラインプレイ。広告なしで数字を合体させ2048タイルを目指そう。ダウンロード不要。",
    ),
    "byd-cars": (
        "2048 BYD カーズ - 無料パズル | 2048 Hub",
        "BYD車テーマの2048を無料プレイ。同じ車を合体させてハイスコアを目指そう。",
    ),
    "2048-cupcakes": (
        "2048 カップケーキ - 無料パズル | 2048 Hub",
        "かわいいカップケーキ版2048を無料でオンラインプレイ。同じスイーツを合体させよう。",
    ),
    "2048cupcakes-christmas": (
        "2048 クリスマスカップケーキ | 2048 Hub",
        "クリスマステーマのカップケーキ2048を無料プレイ。",
    ),
    "2048-remastered": (
        "2048 リマスター - 無料パズル | 2048 Hub",
        "高品質グラフィックの2048リマスター版を無料でオンラインプレイ。",
    ),
    "couch-2048": (
        "カウチ 2048 - 無料パズル | 2048 Hub",
        "カウチ2048を無料プレイ。ピースをドラッグして合体させ2048を目指す。",
    ),
    "doge-2048": (
        "Doge 2048 - 無料パズル | 2048 Hub",
        "ドージミーム版2048を無料でオンラインプレイ。",
    ),
    "card-2048": (
        "カード 2048 - 無料パズル | 2048 Hub",
        "トランプの数字で遊ぶ2048を無料プレイ。",
    ),
    "hex-2048": (
        "ヘックス 2048 - 無料パズル | 2048 Hub",
        "六角形グリッドの2048を無料プレイ。戦略的にタイルを合体させよう。",
    ),
    "schulte-grid": (
        "シュルテ表 - 注意力トレーニング | 2048 Hub",
        "シュルテ表を無料でオンラインプレイ。1から順にタップして集中力を鍛えよう。",
    ),
    "astro-math": (
        "アストロマス - 宇宙算数ゲーム | 2048 Hub",
        "宇宙を舞台にした算数パズルを無料プレイ。小惑星を撃つように問題を解こう。",
    ),
    "taylor-swift-2048": (
        "Taylor Swift 2048 - 無料パズル | 2048 Hub",
        "Taylor Swiftテーマの2048を無料でオンラインプレイ。",
    ),
}

JA_LOCALE_INTRO = {
    "byd-cars": "BYDの車を合体させて<strong>夢の一台</strong>を目指そう！",
    "2048-cupcakes": "同じカップケーキを<strong>合体</strong>させよう！",
    "2048cupcakes-christmas": "クリスマスのカップケーキを<strong>合体</strong>させよう！",
}

JA_EXPLANATION = (
    '<strong class=\\"important\\">遊び方：</strong> '
    '<strong>矢印キー</strong>でタイルを動かします。'
    '同じ絵柄のタイルが触れると<strong>合体してレベルアップ</strong>します！'
)

TEXT_REPLACEMENTS = [
    # Standard 2048 HTML
    ("Join the numbers and get to the <strong>2048 tile!</strong>",
     "数字を合体させて<strong>2048タイル</strong>を目指そう！"),
    ("Join the numbers to find the <strong>last Disney princess!</strong>",
     "数字を合体させて<strong>最後のディズニープリンセス</strong>を見つけよう！"),
    ("Merge BYD cars and create your <strong>Dream Car!</strong>",
     "BYDの車を合体させて<strong>夢の一台</strong>を目指そう！"),
    ("Join the <strong>Cupcakes!</strong>", "同じカップケーキを<strong>合体</strong>させよう！"),
    ("New Game", "新しいゲーム"),
    ("Play Again", "もう一度プレイ"),
    ("Keep going", "続ける"),
    ("Try again", "もう一度"),
    ("Retry", "もう一度"),
    ('content: "Score"', 'content: "スコア"'),
    ('content: "Best"', 'content: "ベスト"'),
    ('content: "POINTS"', 'content: "スコア"'),
    ('content: "BEST"', 'content: "ベスト"'),
    ("You win!", "クリア！"),
    ("Game over!", "ゲームオーバー！"),
    # Hex 2048
    ("Hex 2048", "ヘックス 2048"),
    ("Merge the numbers and reach", "数字を合体させて"),
    ("New Game</button>", "新しいゲーム</button>"),
    # Schulte grid UI
    ("<h1>Schulte Grid</h1>", "<h1>シュルテ表</h1>"),
    ("Mental Training Game - Click the numbers in order starting from 1 to the last number.",
     "注意力トレーニング — 1から順番に数字をタップしてください。"),
    ("Select Grid Size:", "グリッドサイズ:"),
    ("3x3 (Easy)", "3×3（かんたん）"),
    ("4x4 (Medium)", "4×4（ふつう）"),
    ("5x5 (Hard)", "5×5（むずかしい）"),
    ("6x6 (Expert)", "6×6（上級）"),
    ("7x7 (Master)", "7×7（マスター）"),
    ("Game Complete!", "クリア！"),
    ("WELL DONE!", "おめでとう！"),
    ("Restart", "リスタート"),
    ("Next Level", "次のレベル"),
    # xx142-b2exe
    ("Press any key to continue . . .", "続けるには任意のキーを押してください . . ."),
    ("Controls:", "操作:"),
    ("movement", "移動"),
    # Geometry dash
    ("Question", "質問"),
    ("...", "読み込み中..."),
    # Astro-math / couch - common buttons
    ("Start Game", "ゲーム開始"),
    ("Play Game", "プレイ"),
    ("Loading", "読み込み中"),
    # classic-2048 SEO section
    ("Pure 2048 Experience - No Ads, No Distractions", "純粋な2048体験 — 広告なし、邪魔なし"),
    (
        "<strong class=\"important\">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>",
        "<strong class=\"important\">遊び方：</strong> <strong>矢印キー</strong>でタイルを動かします。同じ数字のタイルが触れると<strong>合体します！</strong>",
    ),
    (
        "<strong>Goal:</strong> Reach the <strong>2048 tile</strong> and beyond! This addictive number puzzle game challenges your strategic thinking and keeps you coming back for more.",
        "<strong>目標：</strong> <strong>2048タイル</strong>を目指し、さらに高みへ！戦略的思考を試す中毒性のある数字パズルです。",
    ),
    (
        "<strong>Why choose 2048Hub:</strong> Enjoy a <strong>completely ad-free</strong> and <strong>immersive gaming experience</strong>. No pop-ups, no banners, no interruptions - just pure focus on the game you love. Perfect for those who want to concentrate and achieve their highest score without any distractions.",
        "<strong>2048Hubの特徴：</strong> <strong>完全無広告</strong>で<strong>没入感のあるプレイ</strong>。ポップアップもバナーもなく、ゲームに集中できます。",
    ),
    ('content="en"', 'content="ja"'),
    ("2048 - Ad-Free Immersive Puzzle Game | 2048Hub", "クラシック 2048 - 無料パズル | 2048 Hub"),
    (
        "Play 2048 online for free with no ads! Pure, immersive puzzle game experience. No distractions, just focus on reaching 2048 and beyond.",
        "クラシック2048を無料でオンラインプレイ。広告なしで数字を合体させ2048タイルを目指そう。",
    ),
    ('content="en_US"', 'content="ja_JP"'),
    (
        "Use your arrow keys or swipe to combine similar Doges and score points! ",
        "矢印キーまたはスワイプで同じドージを合体させてスコアを稼ごう！",
    ),
    (
        "Use your arrow keys or swipe to combine similar Doges and score points!",
        "矢印キーまたはスワイプで同じドージを合体させてスコアを稼ごう！",
    ),
    ("Unlock all 11 doges to win!", "11種類すべてのドージを揃えてクリア！"),
]

XX142_INTRO_JA = """こんにちは、<i>xx142-b2.exe</i>

西暦2413年、人類はすでに200年以上、異星人に支配されています。

あなたは異星人ネットワークに侵入し、発電機と兵器システムを無力化するAIウイルスです。

異星人のウイルス対策ソフトは13秒であなたを検知し削除します。

しかし覚えておいてください：ファイルは本当には削除されません。以前の実行のバックトレースを使い、メモリコアを破壊してください。

--------------------------------------

操作:
WASD / 矢印キー — 移動
Backspace — kill -9 xx142-b2.exe

--------------------------------------

"""

XX142_END_JA = """よくできました <i>xx142-b2.exe</i>、

メモリコアを無力化しました。

異星人の船はすべて破壊されました。
人類は奴隷制から解放されました。



チェスでも一局どうですか？ <b id="B">&#xA0;</b>
"""


def copy_games() -> None:
    for slug in COPY_SLUGS:
        src = ROOT / slug
        dst = JA / slug
        if not src.is_dir():
            print(f"skip missing: {slug}")
            continue
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns("node_modules", ".git"))
        print(f"copied {slug}")


def inject_hub_bar(html: str, title: str) -> str:
    if "hub-bar.js" in html:
        return html
    tag = f'<script src="../../hub-bar.js" data-hub-title="{title}" defer></script>\n'
    html = html.replace("../../../hub-bar.js", "../../hub-bar.js")
    if "</body>" in html:
        return html.replace("</body>", tag + "</body>", 1)
    return html


def patch_index_meta(html: str, slug: str) -> str:
    if slug not in GAME_META:
        return html
    title, desc = GAME_META[slug]
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", html, count=1)
    if re.search(r'<meta name="description"', html):
        html = re.sub(
            r'<meta name="description"[^>]*>',
            f'<meta name="description" content="{desc}">',
            html,
            count=1,
        )
    else:
        html = html.replace("<head>", f'<head>\n  <meta name="description" content="{desc}">', 1)
    canon = f"{SITE}/ja/{slug}/"
    en = f"{SITE}/{slug}/"
    if 'rel="canonical"' in html:
        html = re.sub(r'<link rel="canonical" href="[^"]*"', f'<link rel="canonical" href="{canon}"', html, count=1)
    else:
        html = html.replace("<head>", f'<head>\n  <link rel="canonical" href="{canon}">', 1)
    html = re.sub(r'<link[^>]*hreflang="[^"]*"[^>]*>\s*', "", html)
    if 'hreflang="en"' not in html:
        html = html.replace(
            "<head>",
            f'<head>\n  <link rel="alternate" hreflang="en" href="{en}">\n  <link rel="alternate" hreflang="ja" href="{canon}">',
            1,
        )
    html = re.sub(r"<html>\s*", "<html lang=\"ja\">\n", html)
    html = re.sub(r'<html lang="en"', '<html lang="ja"', html)
    html = re.sub(r'name="language" content="en"', 'name="language" content="ja"', html)
    return html


def apply_text_replacements(text: str) -> str:
    for old, new in TEXT_REPLACEMENTS:
        text = text.replace(old, new)
    return text


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


def _ja_ui_replacements(block: str, slug: str) -> str:
    intro = JA_LOCALE_INTRO.get(slug, "タイルを<strong>合体</strong>させよう！")
    block = re.sub(
        r'"%game-intro"\s*:\s*"(?:[^"\\]|\\.)*"',
        f'"%game-intro"           : "{intro}"',
        block,
        count=1,
    )
    for o, n in [
        ('"%restart-button"       : "New Game"', '"%restart-button"       : "新しいゲーム"'),
        ('"%restart-button"       : "Play Again"', '"%restart-button"       : "もう一度プレイ"'),
        ('"%keep-playing-button"  : "Keep going"', '"%keep-playing-button"  : "続ける"'),
        ('"%retry-button"         : "Retry"', '"%retry-button"         : "もう一度"'),
        ('"%game-won"             : "You win!"', '"%game-won"             : "クリア！"'),
        ('"%game-over"            : "Game over!"', '"%game-over"            : "ゲームオーバー！"'),
    ]:
        block = block.replace(o, n)
    block = re.sub(
        r'("%game-explanation"\s*:\s*")(?:[^"\\]|\\.)*(")',
        rf'\1{JA_EXPLANATION}\2',
        block,
        count=1,
    )
    return block


def patch_localization(path: Path, slug: str) -> None:
    text = path.read_text(encoding="utf-8")
    ja_span = _find_locale_block(text, "ja")
    if ja_span:
        start, end = ja_span
        block = text[start:end]
        if "How to play:" in block or block.count("遊び方") > 1:
            prefix = text[:start].rstrip()
            if prefix.endswith(","):
                prefix = prefix[:-1]
            text = prefix + text[end:]
            ja_span = None
        else:
            text = text[:start] + _ja_ui_replacements(block, slug) + text[end:]
    if not ja_span:
        en_span = _find_locale_block(text, "en")
        if not en_span:
            return
        start, end = en_span
        en_block = text[start:end]
        ja_content = en_block.replace('"en":', '"ja":', 1).replace("'en':", "'ja':", 1)
        ja_content = _ja_ui_replacements(ja_content, slug)
        text = text[:end] + ",\n" + ja_content + text[end:]
    text = re.sub(r'String\.locale\s*=\s*"[^"]+"', 'String.locale = "ja"', text)
    text = re.sub(r'String\.defaultLocale\s*=\s*"[^"]+"', 'String.defaultLocale = "ja"', text)
    path.write_text(text, encoding="utf-8")


def process_game_dir(slug: str) -> None:
    d = JA / slug
    if not d.is_dir():
        return
    title = GAME_META.get(slug, (slug, ""))[0].split("|")[0].strip()

    for path in d.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".html", ".js", ".css", ".htm"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        orig = text
        text = apply_text_replacements(text)
        if path.name == "index.html":
            text = patch_index_meta(text, slug)
            text = inject_hub_bar(text, title)
            path.write_text(text, encoding="utf-8")
            continue
        if path.name == "localization.js":
            patch_localization(path, slug)
            continue
        if slug == "xx142-b2exe" and path.name == "index.html":
            text = re.sub(
                r"<pre id=\"intro\">.*?</pre>",
                f"<pre id=\"intro\">{XX142_INTRO_JA}続けるには任意のキーを押してください . . . <b id=\"B\">&#xA0;</b>\n</pre>",
                text,
                flags=re.DOTALL,
            )
            text = re.sub(
                r"<pre id=\"end\">.*?</pre>",
                f"<pre id=\"end\">{XX142_END_JA}\n    </pre>",
                text,
                flags=re.DOTALL,
            )
        # Path fixes for assets (ja/* is two levels below root)
        text = text.replace("../../../hub-bar.js", "../../hub-bar.js")
        text = text.replace("../hub-bar.js", "../../hub-bar.js")
        text = text.replace("../../../favicon.svg", "../../favicon.svg")
        text = text.replace("../favicon.svg", "../../favicon.svg")
        text = text.replace('href="../favicon', 'href="../../favicon')
        text = text.replace(" or even ", " や ")
        if text != orig and path.name != "localization.js":
            path.write_text(text, encoding="utf-8")

    loc = d / "js" / "localization.js"
    if loc.is_file():
        patch_localization(loc, slug)


def main() -> None:
    import sys

    if "--copy" in sys.argv:
        copy_games()
    for slug in COPY_SLUGS:
        process_game_dir(slug)
    # Also refresh partial translations on other ja games
    for extra in [
        "xx142-b2exe",
        "parity",
        "flappy-2048",
        "geometrydash",
        "8-puzzle",
        "2048-princess",
        "2048-minecraft",
        "breakout",
        "captaincallisto",
        "chromedino",
        "blackholesquare",
    ]:
        if (JA / extra).is_dir():
            process_game_dir(extra)
    print("ja/ sync complete")


if __name__ == "__main__":
    main()
