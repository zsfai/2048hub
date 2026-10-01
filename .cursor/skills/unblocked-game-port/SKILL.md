---
name: unblocked-game-port
description: >-
  Ports an HTML5/Construct game into a pure-static unblocked page for 2048hub:
  strip ads/shells, remove watermarks, skip blank intro transitions, light arcade
  intro under Play, hub-bar + Quick Game Access + sitemap wiring. Use when the
  user asks to 改造/unblocked/纯静态 a game folder (e.g. *-unblocked), or mentions
  keywords like "volley random unblocked" / "basket random unblocked".
---

# Unblocked Game Port (2048hub)

Convert a third-party HTML5 game folder into a clean, static, hub-integrated
unblocked page. Canonical references: `volley-random-unblocked/`,
`basket-random-unblocked/`.

## Required inputs

Ask only if missing:

1. **Folder** — e.g. `foo-random-unblocked/`
2. **Keyword / title** — e.g. `basket random unblocked` → title `Basket Random Unblocked`
3. **One-line pitch** under Play (game-like, not SEO stuffing)

Do **not** commit/push unless the user asks.

## Progress checklist

Copy and track:

```
- [ ] 1. Audit & delete junk
- [ ] 2. Neutralize external links / ads events
- [ ] 3. Watermarks (sprites + intro objects)
- [ ] 4. Skip blank intro / Play → game
- [ ] 5. Rewrite index + style + appmanifest
- [ ] 6. Wire hub (Quick Access, EXTRA_EN_PAGES, sitemap, README)
- [ ] 7. Verify over HTTP (not file://)
```

## Step 1 — Audit & delete junk

Remove distributor shells and ad SDKs (keep only game runtime):

- Delete if present: `patch/`, ad `js/` (analytics_*, ubg*, gd-*, YYG*, Azerion*),
  shell HTML (`games235.html`, `ubg235.html`, `frame.html`, `408.html`, …
  keep only the real game `index.html`), weird verification files, extra manifests
- Keep: `scripts/` (Construct runtime), `images/`, `media/`, `data.json`,
  `box2d.wasm*`, `style.css`, `appmanifest.json`, `sw.js` (or stub)

Search leftovers:

```bash
rg -i "twoplayer|gamedistribution|games235|googletag|adservice|utm_source|YYG|Azerion" <folder>
```

## Step 2 — Neutralize links & ads

- In `scripts/c3runtime.js` (and any other JS): replace distributor URLs
  (`twoplayergames.org`, GameDistribution, etc.) with `#`
- In Construct `data.json`:
  - Clear ad event sheets (e.g. `gdEvent` → empty event list)
  - **Remove ALL `GameDistributionSDK` (or similar) actions** — especially ShowAd
    (`[sdkId, 181, ...]`). If left in place after deleting ad JS, **1P/2P / Play
    clicks appear dead** because the event action list stops on the missing SDK.
  - Remove `Browser` GoToURL actions (action id `176` on Browser object)
  - Hide `moreButton` / store / “MORE games” instances (`visible = false`)
  - Remove ExecuteJavaScript / ad hooks on intro if present

Allowed remaining absolute URLs: `2048hub.com`, `schema.org`, Construct engine
help links inside supportcheck (same as other hub games).

## Step 3 — Watermarks (hard requirement)

**Done means:** no `twoplayergames.org` / `TWOPLAYERGAMES` text is visible on intro
or in-game. Pure static — no external brand sprites, no distributor URLs.

Typical Construct Random-series marks:

- Object `introtwporg` (progressive logo animation on intro)
- Object **`TPG`** (in-game / menu `twoplayergames.org` bar — easy to miss)
- Sheets: `images/shared-0-sheet1/2/3.png` hold `TWOPLAYERGAMES` / `.ORG` bars
- Do **not** wipe `shared-1-sheet0.png` — that is usually the colorful **PLAY**
  button (yellow/cyan/lime/orange letters), not the watermark

Required actions:

1. **Keep a pristine original** (Downloads copy or git) before pixel edits
2. Clear **only** watermark letter boxes — never wipe an entire atlas (limbs/UI)
3. Find brand with lime+cyan seed; expand box for orange `GAMES/.ORG` + black outline
4. Preserve red hoop rims, titles (`BASKET!`, `CPU WINS`), HOLD prompts, PLAY button
5. Set every `introtwporg` **and `TPG`** instance `visible = false`
6. Replace those objects' animation frames with one empty transparent 8×8 frame
7. Update `data.json` image **filesize** fields to match new PNGs (helps cache bust)
8. Verify by cropping each former watermark `xywh` — opaque pixel count must be `0`
9. Delete temporary `_wm/` folders when done
10. Ask user to **hard-refresh** (`Ctrl+F5`) — browsers often cache old atlases
11. Search object names for `TPG` / `twop` / `credit` before declaring done

## Step 4 — Skip blank intro transition

Play must not wait on fade/watermark timelines then land on a blank layout.

In `data.json` intro Play event (object `play_intro_btn` On touched/clicked):

Keep only:

1. Hide play button
2. Play `intro-sound` (optional)
3. Go to layout `"game"` (system action `195`)

Remove waits, tweens, multi-step layout hops that cause a blank frame.

## Step 5 — Rewrite entry (match volley/basket)

Templates: see [templates.md](templates.md).

Must include:

- Title: `{Keyword Title} | 2048 Hub`
- Canonical / OG / JSON-LD `VideoGame` for `https://2048hub.com/<slug>/`
- **No** `keywords` meta, no hidden crawl text, no keyword stuffing
- `#game-intro` with continuous `<h1>` + one short `<p>` (arcade tone)
- `file://` guard (Chinese message + `python -m http.server` hint)
- Sequential script load: `box2d.wasm.js` → supportcheck → offlineclient → main →
  register-sw → `../hub-bar.js`
- Hide intro on first `pointerdown`
- `appmanifest.json` name/short_name/description updated
- `style.css` `.game-intro` styles copied from `volley-random-unblocked/style.css`

## Step 6 — Wire hub

| File | Change |
|------|--------|
| `index.html` | Add card under **Quick Game Access** (not left sidebar `script.js` games) |
| `scripts/rebuild-sitemap.py` | Append slug to `EXTRA_EN_PAGES` |
| run | `python scripts/rebuild-sitemap.py` |
| `README.md` | One row in the arcade/other games table |

Quick Access card pattern (after an existing NEW card):

```html
<a href="https://2048hub.com/<slug>/" class="game-link-item">
  <span class="new-badge">NEW</span>
  <span class="game-link-icon">🎮</span>
  <div class="game-link-info">
    <h4>{Title}</h4>
    <p>{Short genre line}</p>
  </div>
</a>
```

Do **not** add the game to `script.js` iframe sidebar unless the user asks.

## Step 7 — Verify

```bash
python -m http.server 8765
# open http://127.0.0.1:8765/<slug>/
```

Check:

- [ ] No `file://` Construct alert when using HTTP
- [ ] Play enters gameplay without blank watermark transition
- [ ] **No `twoplayergames.org` / TWOPLAYERGAMES watermark** on intro or in-game
- [ ] No third-party ad/network calls for distributors
- [ ] Intro line readable under Play; disappears on interaction
- [ ] Hub bar loads; Quick Access link works
- [ ] Hard-refresh verified (not stale cached PNGs)

## Anti-patterns

- SEO stuffing (keyword lists, letter-split `<h1>`, hidden paragraphs)
- Left-sidebar iframe registration by default
- Clearing whole sprite atlases (or wiping PLAY sheet as “brand”)
- Leaving `introtwporg` frames pointing at logo pixels (hide alone is not enough)
- Committing unless asked
- Shipping with `patch/` or analytics JS still referenced
