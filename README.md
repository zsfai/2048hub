# 2048 Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[2048 Hub](https://2048hub.com/) 是一个**静态站点**形式的在线小游戏合集，主打各类 2048 变体，并收录多款经典益智与街机小游戏。无需下载，浏览器打开即可试玩。

- **英文站**：[2048hub.com](https://2048hub.com/)
- **日文站**：[2048hub.com/ja](https://2048hub.com/ja/)
- **西语站**：[2048hub.com/es](https://2048hub.com/es/)
- **法语站**：[2048hub.com/fr](https://2048hub.com/fr/)
- **意大利语站**：[2048hub.com/it](https://2048hub.com/it/)

---

## 功能概览

- 首页侧边栏通过 iframe 嵌入游玩（`script.js` 中配置的游戏）
- 各游戏独立目录，可单独访问（利于 SEO 与分享）
- 英文 / 日文 / 西语 / 法语 / 意大利语：`ja/`、`es/`、`fr/`、`it/` 为各语言静态副本（非运行时 i18n）
- 各游戏页可挂载 `hub-bar.js` 返回 Hub 导航

---

## 项目结构

```
2048hub/
├── index.html          # 英文 Hub 首页
├── script.js           # 首页游戏列表与 iframe 逻辑
├── styles.css
├── hub-bar.js          # 游戏内顶部 Hub 导航条
├── sitemap.xml         # 站点地图（en/ja/es/fr/it hreflang）
├── ja/                 # 日文 Hub 与各游戏日文版
├── es/                 # 西语 Hub 与各游戏西语版
├── fr/                 # 法语 Hub 与各游戏法语版
├── it/                 # 意大利语 Hub 与各游戏意语版
│   ├── index.html
│   ├── script.js
│   └── {game-slug}/    # 与根目录同 slug 的本地化副本
├── scripts/
│   ├── sync-ja-games.py    # 同步并翻译到 ja/
│   ├── sync-locales.py     # 同步并翻译到 es/、fr/、it/
│   └── build-hub-locales.py  # 生成 es/、fr/、it/ Hub 首页
└── {game-slug}/        # 各游戏英文资源目录
```

---

## 游戏目录（共 24 款）

下表列出仓库中全部游戏，含**在线试玩链接**（英 / 日 / 西 / 法）。本地仓库路径见「目录」列。

| Hub 首页 | [英语版](https://2048hub.com/) · [日语版](https://2048hub.com/ja/) · [西语版](https://2048hub.com/es/) · [法语版](https://2048hub.com/fr/) · [意语版](https://2048hub.com/it/) | — | 游戏合集入口 |

### 2048 及主题变体

| 游戏 | 在线试玩 | 目录 | 说明 |
|------|----------|------|------|
| Classic 2048 | [英语版](https://2048hub.com/classic-2048/) · [日语版](https://2048hub.com/ja/classic-2048/) | `classic-2048/` | 经典数字 2048 |
| Taylor Swift 2048 | [英语版](https://2048hub.com/taylor-swift-2048/) · [日语版](https://2048hub.com/ja/taylor-swift-2048/) | `taylor-swift-2048/` | Taylor Swift 主题图块 |
| 2048 Cupcakes | [英语版](https://2048hub.com/2048-cupcakes/) · [日语版](https://2048hub.com/ja/2048-cupcakes/) | `2048-cupcakes/` | 纸杯蛋糕主题 |
| 2048 Cupcakes Christmas | [英语版](https://2048hub.com/2048cupcakes-christmas/) · [日语版](https://2048hub.com/ja/2048cupcakes-christmas/) | `2048cupcakes-christmas/` | 圣诞纸杯蛋糕主题 |
| 2048 Princess | [英语版](https://2048hub.com/2048-princess/) · [日语版](https://2048hub.com/ja/2048-princess/) | `2048-princess/` | 迪士尼公主主题 |
| 2048 Cats | [英语版](https://2048hub.com/2048-cats/) · [日语版](https://2048hub.com/ja/2048-cats/) | `2048-cats/` | 按尊贵程度合体升级的猫主题 |
| 2048 Minecraft | [英语版](https://2048hub.com/2048-minecraft/) · [日语版](https://2048hub.com/ja/2048-minecraft/) | `2048-minecraft/` | 我的世界方块主题 |
| Couch 2048 | [英语版](https://2048hub.com/couch-2048/) · [日语版](https://2048hub.com/ja/couch-2048/) | `couch-2048/` | 拖拽式 2048 |
| Card 2048 | [英语版](https://2048hub.com/card-2048/) · [日语版](https://2048hub.com/ja/card-2048/) | `card-2048/` | 扑克牌数字主题（Construct） |
| 2048 BYD Cars | [英语版](https://2048hub.com/byd-cars/) · [日语版](https://2048hub.com/ja/byd-cars/) | `byd-cars/` | BYD 车型主题 |
| Doge 2048 | [英语版](https://2048hub.com/doge-2048/) · [日语版](https://2048hub.com/ja/doge-2048/) | `doge-2048/` | Doge 梗图主题 |
| 2048 Remastered | [英语版](https://2048hub.com/2048-remastered/) · [日语版](https://2048hub.com/ja/2048-remastered/) | `2048-remastered/` | 重制版画面与音效 |
| Hex 2048 | [英语版](https://2048hub.com/hex-2048/) · [日语版](https://2048hub.com/ja/hex-2048/) | `hex-2048/` | 六边形网格 2048 |
| Flappy 2048 | [英语版](https://2048hub.com/flappy-2048/) · [日语版](https://2048hub.com/ja/flappy-2048/) | `flappy-2048/` | Flappy Bird × 2048 |

### 益智 / 脑力

| 游戏 | 在线试玩 | 目录 | 说明 |
|------|----------|------|------|
| Schulte Grid | [英语版](https://2048hub.com/schulte-grid/) · [日语版](https://2048hub.com/ja/schulte-grid/) | `schulte-grid/` | 舒尔特方格，按序点击数字 |
| Parity | [英语版](https://2048hub.com/parity/) · [日语版](https://2048hub.com/ja/parity/) | `parity/` | 黑白格数字翻转解谜 |
| 8 Puzzle | [英语版](https://2048hub.com/8-puzzle/) · [日语版](https://2048hub.com/ja/8-puzzle/) | `8-puzzle/` | 经典八数码滑块 |
| Black Hole Square | [英语版](https://2048hub.com/blackholesquare/) · [日语版](https://2048hub.com/ja/blackholesquare/) | `blackholesquare/` | 黑洞方块空间解谜 |

### 街机 / 动作

| 游戏 | 在线试玩 | 目录 | 说明 |
|------|----------|------|------|
| xx142-b2.exe | [英语版](https://2048hub.com/xx142-b2exe/) · [日语版](https://2048hub.com/ja/xx142-b2exe/) | `xx142-b2exe/` | 终端风格黑客解谜 |
| Breakout | [英语版](https://2048hub.com/breakout/) · [日语版](https://2048hub.com/ja/breakout/) | `breakout/` | 打砖块 |
| Captain Callisto | [英语版](https://2048hub.com/captaincallisto/) · [日语版](https://2048hub.com/ja/captaincallisto/) | `captaincallisto/` | 太空冒险平台 |
| Chrome Dino | [英语版](https://2048hub.com/chromedino/) · [日语版](https://2048hub.com/ja/chromedino/) | `chromedino/` | 离线小恐龙跑酷 |
| Geometry Dash | [英语版](https://2048hub.com/geometrydash/) · [日语版](https://2048hub.com/ja/geometrydash/) | `geometrydash/` | 节奏平台跳跃 |

### 教育

| 游戏 | 在线试玩 | 目录 | 说明 |
|------|----------|------|------|
| Astro Math | [英语版](https://2048hub.com/astro-math/) · [日语版](https://2048hub.com/ja/astro-math/) | `astro-math/` | 太空主题算术射击 |

---

## 首页 iframe 列表说明

`script.js` / `ja/script.js` 中的 `games` 数组决定**侧边栏可 iframe 加载**的游戏（当前为 15 款 2048 类）。其余游戏在首页「Quick Game Access」区域以直链方式进入，同样可独立访问。

若需将新游戏加入侧边栏 iframe 列表，在 `script.js` 中追加条目，例如：

```javascript
{
    id: 'my-game-slug',
    title: 'My Game',
    description: 'Short description',
    icon: '🎮',
    url: 'https://2048hub.com/my-game-slug/',
    iframe: true
}
```

---

## 本地运行

任意静态文件服务器即可，例如：

```bash
# Python
python -m http.server 8080

# Node（需已安装 npx）
npx serve .
```

浏览器访问 `http://localhost:8080/`。游戏路径与线上一致（如 `/classic-2048/`）。

---

## 多语言维护

**日文**（`ja/`）：

```bash
python scripts/sync-ja-games.py
python scripts/sync-ja-games.py --copy   # 从英文目录重新复制后再翻译
```

**西语 / 法语 / 意大利语**（`es/`、`fr/`、`it/`）：

```bash
python scripts/sync-locales.py
python scripts/sync-locales.py --copy    # 首次或需全量覆盖时
python scripts/sync-locales.py --copy --only=it   # 仅同步意大利语
python scripts/build-hub-locales.py      # 重建 es/、fr/、it/ Hub 与五语言导航
python scripts/rebuild-sitemap.py        # 重建五语言 sitemap
python scripts/patch-hreflang-en-ja.py   # 为各语言游戏页补全 hreflang
```

---

## 技术栈

- 纯 HTML / CSS / JavaScript（无构建步骤）
- 部分游戏为第三方开源或改编项目（如 classic-2048、hex-2048 等），详见各子目录内 LICENSE / README

---

## 许可与致谢

本仓库 **Hub 站点层**（首页、`hub-bar.js`、`styles.css`、`ja/` 枢纽页及维护脚本等）采用 [MIT License](LICENSE) 开源。

各游戏子目录多为第三方改编或独立项目，可能使用 **其他许可**（例如 `classic-2048/LICENSE.txt`）。再分发或商用时请以各子目录内的许可文件为准。

- 原版 [2048](https://github.com/gabrielecirulli/2048) 由 Gabriele Cirulli 创作。
