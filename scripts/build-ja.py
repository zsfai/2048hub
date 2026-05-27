#!/usr/bin/env python3
"""Translate copied ja/ pages and create stub pages for external games."""
from __future__ import annotations
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JA = ROOT / "ja"
SITE = "https://2048hub.com"

# External games (no local source in repo) — Japanese SEO landing + iframe to EN
STUB_GAMES = [
    ("classic-2048", "クラシック 2048", "初心者にもやさしい、オリジナルの2048パズル", "🔢"),
    ("byd-cars", "2048 BYD カーズ", "BYD車テーマの2048。全年齢向け", "🚗"),
    ("2048-cupcakes", "2048 カップケーキ", "かわいいカップケーキテーマの2048", "🧁"),
    ("taylor-swift-2048", "Taylor Swift 2048", "Taylor Swiftテーマの2048", "🎤"),
    ("2048cupcakes-christmas", "2048 クリスマスカップケーキ", "クリスマステーマのカップケーキ2048", "🎄"),
    ("doge-2048", "Doge 2048", "ドージミームタイルの2048", "🐶"),
    ("card-2048", "カード 2048", "トランプの数字で遊ぶ2048", "🃏"),
    ("2048-remastered", "2048 リマスター", "高品質グラフィックの2048", "🎮"),
    ("couch-2048", "カウチ 2048", "リラックスできる2048", "🛋️"),
    ("hex-2048", "ヘックス 2048", "六角形グリッドの2048", "⬡"),
    ("schulte-grid", "シュルテ表", "注意力トレーニングパズル", "🧠"),
    ("astro-math", "アストロマス", "宇宙と算数のパズルゲーム", "🚀"),
]

STUB_TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | 2048 Hub</title>
  <meta name="description" content="{desc}。ブラウザで無料プレイ、ダウンロード不要。">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{site}/ja/{slug}/">
  <link rel="alternate" hreflang="en" href="{site}/{slug}/">
  <link rel="alternate" hreflang="ja" href="{site}/ja/{slug}/">
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{site}/ja/{slug}/">
  <meta property="og:title" content="{title} | 2048 Hub">
  <meta property="og:description" content="{desc}">
  <meta property="og:site_name" content="2048 Hub">
  <meta property="og:image" content="{site}/favicon.svg">
</head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#f5f6fa;">
  <main style="max-width:900px;margin:0 auto;padding:16px;">
    <p><a href="../">← 2048 Hub 日本語トップ</a> · <a href="../../">English</a></p>
    <h1>{icon} {title}</h1>
    <p>{desc}</p>
    <iframe src="{site}/{slug}/" title="{title}" style="width:100%;height:min(80vh,700px);border:0;border-radius:12px;background:#fff;" allowfullscreen></iframe>
  </main>
  <script src="../../hub-bar.js" data-hub-title="{title}" data-hub-home="{site}/ja/" defer></script>
</body>
</html>
"""

# Global text replacements (HTML + JS in ja/)
REPLACEMENTS = [
    ('lang="en"', 'lang="ja"'),
    ('<html lang="en">', '<html lang="ja">'),
    ('../hub-bar.js', '../../hub-bar.js'),
    ('../favicon.svg', '../../favicon.svg'),
    ('href="../favicon', 'href="../../favicon'),
    # Hub
    ('2048 Hub - Play 2048 Games Online | Free 2048 Variants Collection',
     '2048 Hub - 無料で2048ゲームをオンラインプレイ'),
    ('Play the best 2048 games online for free!',
     '2048 Hubで人気の2048バリエーションを無料プレイ。'),
    ('Play 2048 Games Online', '2048ゲームをオンラインで'),
    ('Choose Game', 'ゲームを選ぶ'),
    ('Select a Game', 'ゲームを選択'),
    ('Home', 'ホーム'),
    ('2048 Game Collection', '2048ゲームコレクション'),
    ('Select your favorite 2048 variant and start playing instantly',
     'お気に入りの2048を選んで、すぐにプレイ開始'),
    ('Instant Play', 'すぐ遊べる'),
    ('Multiple Variants', '豊富なバリエーション'),
    ('Cross Platform', 'マルチデバイス対応'),
    ('2048 Game Guide & Tips', '2048攻略ガイド'),
    ('Everything you need to know about 2048 games', '2048ゲームの基本とコツ'),
    ('How to Win in 2048 Game?', '2048で勝つには？'),
    ('What is the Origin of 2048 Game?', '2048の起源は？'),
    ('🎯 Quick Game Access', '🎯 クイックアクセス'),
    ('Ready to put these tips into practice?',
     'コツを試してみましょう。'),
    ('Choose a game from the menu above and start playing!',
     '上のメニューからゲームを選んでプレイ！'),
    ('Play the best puzzle games online for free!',
     '無料パズルゲームをオンラインで'),
    ('Game Loading Failed', 'ゲームの読み込みに失敗しました'),
    ('Unable to connect to the game server. Please try again later.',
     'サーバーに接続できません。しばらくしてからお試しください。'),
    ('Open in New Window', '新しいウィンドウで開く'),
    ('Start Game →', 'ゲームを始める →'),
    ('https://2048hub.com/', 'https://2048hub.com/ja/'),
    # 2048 princess / minecraft
    ('2048 Princess | 2048 Hub', '2048 プリンセス | 2048 Hub'),
    ('Play 2048 Princess online for free. Merge numbered tiles in a rose-pink themed 2048 game and unlock princess characters. No download required.',
     '2048 プリンセスを無料でオンラインプレイ。ローズピンクテーマでタイルを合体させ、プリンセスを集めよう。ダウンロード不要。'),
    ('Play 2048 Princess online for free. Merge tiles to unlock princess characters in a rose-pink themed 2048 game.',
     '2048 プリンセスを無料でプレイ。タイルを合体させてプリンセスを集めよう。'),
    ('2048 Princess', '2048 プリンセス'),
    ('Join the numbers to find the <strong>last Disney princess!</strong>',
     '数字を合体させて<strong>最後のディズニープリンセス</strong>を見つけよう！'),
    ('New Game', '新しいゲーム'),
    ('Keep going', '続ける'),
    ('Try again', 'もう一度'),
    ('<strong class="important">How to play:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>',
     '<strong class="important">遊び方：</strong> <strong>矢印キー</strong>でタイルを動かします。同じ数字のタイルが触れると<strong>合体</strong>します！'),
    ('2048 Minecraft | 2048 Hub', '2048 マインクラフト | 2048 Hub'),
    ('Play 2048 Minecraft online for free. Combine Minecraft blocks on the grid to reach 2048. No download required.',
     '2048 マインクラフトを無料でオンラインプレイ。ブロックを合体させて2048を目指そう。ダウンロード不要。'),
    ('Play 2048 Minecraft online for free. Combine Minecraft blocks to score 2048 points.',
     '2048 マインクラフトを無料でプレイ。ブロックを合体させて2048点を目指そう。'),
    ('2048 Minecraft', '2048 マインクラフト'),
    ('Combine the <strong>blocks!</strong>', 'ブロックを<strong>合体</strong>させよう！'),
    # flappy
    ('Flappy 2048 | 2048 Hub', 'Flappy 2048 | 2048 Hub'),
    ('Loading...', '読み込み中...'),
    # 8-puzzle
    ('8 Puzzle | 2048Hub', '8パズル | 2048 Hub'),
    ('8 Puzzle Game', '8パズル'),
    ('Time: 0s', '時間: 0秒'),
    ('Shuffle', 'シャッフル'),
    ('Reset', 'リセット'),
    # breakout
    ('Breakout | 2048 Hub', 'ブロック崩し | 2048 Hub'),
    ('level:', 'レベル:'),
    ('sound', 'サウンド'),
    ('space</b> to start<br>', 'スペース</b>で開始<br>'),
    ('left/right</b> to move paddle<br>', '左右</b>でパドル移動<br>'),
    ('up/down</b> to change level', '上下</b>でレベル変更'),
    ('touch here</b> to start<br>', 'ここをタップ</b>で開始<br>'),
    ('drag</b> paddle to move<br>', 'ドラッグ</b>でパドル移動<br>'),
    ('Sorry, this example cannot be run because your browser does not support the &lt;canvas&gt; element',
     'お使いのブラウザは &lt;canvas&gt; に対応していないため、このゲームは実行できません'),
    ('next level', '次のレベル'),
    ('previous level', '前のレベル'),
    # parity
    ('Parity - Number Puzzle Game | 2048 Hub', 'Parity - 数字パズル | 2048 Hub'),
    ('level #', 'レベル #'),
    # captain
    ('Captain Callisto | 2048 Hub', 'キャプテン・カリスト | 2048 Hub'),
    # blackhole
    ('Black Hole Square | 2048 Hub', 'ブラックホールスクエア | 2048 Hub'),
    ('Clean the universe!', '宇宙をきれいにしよう！'),
    # script.js games
    ("title: 'Classic 2048'", "title: 'クラシック 2048'"),
    ("description: 'Original 2048 game, simple and easy to learn for beginners'",
     "description: '初心者にもやさしい、オリジナルの2048パズル'"),
    ("url: 'https://2048hub.com/classic-2048/'", "url: 'https://2048hub.com/ja/classic-2048/'"),
    ("title: 'Taylor Swift 2048'", "title: 'Taylor Swift 2048'"),
    ("url: 'https://2048hub.com/taylor-swift-2048/'", "url: 'https://2048hub.com/ja/taylor-swift-2048/'"),
    ("title: '2048 Cupcakes'", "title: '2048 カップケーキ'"),
    ("url: 'https://2048hub.com/2048-cupcakes/'", "url: 'https://2048hub.com/ja/2048-cupcakes/'"),
    ("title: '2048 Cupcakes Christmas'", "title: '2048 クリスマスカップケーキ'"),
    ("url: 'https://2048hub.com/2048cupcakes-christmas/'", "url: 'https://2048hub.com/ja/2048cupcakes-christmas/'"),
    ("title: '2048 Princess'", "title: '2048 プリンセス'"),
    ("url: 'https://2048hub.com/2048-princess/'", "url: 'https://2048hub.com/ja/2048-princess/'"),
    ("title: '2048 Minecraft'", "title: '2048 マインクラフト'"),
    ("url: 'https://2048hub.com/2048-minecraft/'", "url: 'https://2048hub.com/ja/2048-minecraft/'"),
    ("url: 'https://2048hub.com/flappy-2048/'", "url: 'https://2048hub.com/ja/flappy-2048/'"),
    ("title: 'Flappy 2048'", "title: 'Flappy 2048'"),
    ("description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles'",
     "description: 'Flappy Bird × 2048。パイプをくぐりながらタイルを合体'"),
    ("'NEW'", "'新着'"),
]

CANONICAL_FIX = re.compile(
    r'<link rel="canonical" href="https://2048hub\.com/([^"]+)/?"\s*/?>'
)


def fix_canonical(content: str, ja_path: str) -> str:
    slug = ja_path.replace("\\", "/").strip("/")
    if slug == "index.html" or slug == "ja":
        return content.replace(
            '<link rel="canonical" href="https://2048hub.com/">',
            '<link rel="canonical" href="https://2048hub.com/ja/">',
        )
    m = re.search(r"ja/([^/]+)/", ja_path.replace("\\", "/"))
    if m:
        slug = m.group(1)
        content = CANONICAL_FIX.sub(
            f'<link rel="canonical" href="{SITE}/ja/{slug}/">', content, count=1
        )
        if 'hreflang="en"' not in content and "<head>" in content:
            content = content.replace(
                "<head>",
                f'<head>\n  <link rel="alternate" hreflang="en" href="{SITE}/{slug}/">\n  <link rel="alternate" hreflang="ja" href="{SITE}/ja/{slug}/">',
                1,
            )
    return content


def apply_replacements(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def translate_file(path: Path) -> None:
    if path.suffix not in {".html", ".js", ".css"}:
        return
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return
    original = text
    text = apply_replacements(text)
    if path.name == "html_actuator.js":
        text = text.replace("You win!", "クリア！").replace("Game over!", "ゲームオーバー！")
    if path.name == "main.css" and "2048-princess" in str(path) or "2048-minecraft" in str(path):
        text = text.replace('content: "Score"', 'content: "スコア"')
        text = text.replace('content: "Best"', 'content: "ベスト"')
    rel = str(path.relative_to(ROOT))
    text = fix_canonical(text, rel)
    if text != original:
        path.write_text(text, encoding="utf-8")


def add_hub_hreflang() -> None:
    hub = JA / "index.html"
    if not hub.exists():
        return
    text = hub.read_text(encoding="utf-8")
    if 'hreflang="ja"' not in text:
        text = text.replace(
            '<link rel="canonical" href="https://2048hub.com/ja/">',
            '<link rel="canonical" href="https://2048hub.com/ja/">\n    <link rel="alternate" hreflang="en" href="https://2048hub.com/">\n    <link rel="alternate" hreflang="ja" href="https://2048hub.com/ja/">\n    <link rel="alternate" hreflang="x-default" href="https://2048hub.com/">',
        )
    if "日本語" not in text and "English" not in text:
        text = text.replace(
            '<p class="tagline">2048ゲームをオンラインで</p>',
            '<p class="tagline">2048ゲームをオンラインで</p>\n                <p class="lang-switch"><a href="https://2048hub.com/">English</a> · <a href="https://2048hub.com/ja/">日本語</a></p>',
        )
    text = text.replace('href="favicon.svg"', 'href="../favicon.svg"')
    hub.write_text(text, encoding="utf-8")


def create_stubs() -> None:
    for slug, title, desc, icon in STUB_GAMES:
        d = JA / slug
        d.mkdir(parents=True, exist_ok=True)
        html = STUB_TEMPLATE.format(
            title=title, desc=desc, icon=icon, slug=slug, site=SITE
        )
        (d / "index.html").write_text(html, encoding="utf-8")


def walk_ja() -> None:
    for path in JA.rglob("*"):
        if path.is_file():
            translate_file(path)


def main() -> None:
    create_stubs()
    walk_ja()
    add_hub_hreflang()
    print("ja/ build complete:", len(list(JA.rglob("index.html"))), "index.html files")


if __name__ == "__main__":
    main()
