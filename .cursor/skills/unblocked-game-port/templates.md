# Templates for unblocked-game-port

Replace `<slug>`, `{Title}`, `{Short description}`, `{Pitch}`.

## index.html

Copy structure from `volley-random-unblocked/index.html` or `basket-random-unblocked/index.html`.

Key blocks:

```html
<title>{Title} | 2048 Hub</title>
<meta name="description" content="{Short description}">
<link rel="canonical" href="https://2048hub.com/<slug>/">
<!-- og:* + JSON-LD VideoGame with same name/url/description -->

<main id="game-intro" class="game-intro">
  <h1>{Title}</h1>
  <p>{Pitch}</p>
</main>
```

Pitch examples (keep one line, game-like):

- Volley: `Physics volleyball with random characters. Solo vs CPU or local 2P — move, jump, keep the ball up.`
- Basket: `Physics basketball with random characters. Solo vs CPU or local 2P — jump, dunk, score.`

Script bootstrap (body end):

```javascript
(function () {
  if (location.protocol === "file:") {
    document.body.style.cssText = "overflow:auto;padding:2rem;font-family:Segoe UI,sans-serif;background:#111;color:#eee;";
    document.body.innerHTML =
      "<h1>{Title}</h1>" +
      "<p>请勿直接双击打开本文件。浏览器的 <code>file://</code> 协议无法运行此游戏。</p>" +
      "<p>在项目根目录启动本地服务后访问：</p>" +
      "<pre style=\"background:#222;padding:1rem;border-radius:8px;\">python -m http.server 8765\n\n然后打开：\nhttp://127.0.0.1:8765/<slug>/</pre>";
    return;
  }
  var intro = document.getElementById("game-intro");
  document.addEventListener("pointerdown", function () {
    if (intro) intro.classList.add("is-hidden");
  }, { once: true, capture: true });
  function loadScript(src, defer) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      if (defer) s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  loadScript("box2d.wasm.js")
    .then(function () { return loadScript("scripts/supportcheck.js"); })
    .then(function () { return loadScript("scripts/offlineclient.js"); })
    .then(function () { return loadScript("scripts/main.js"); })
    .then(function () { return loadScript("scripts/register-sw.js"); })
    .then(function () { return loadScript("../hub-bar.js", true); })
    .catch(function (err) { console.error("Failed to load game scripts", err); });
})();
```

## style.css

Append (or replace) using `volley-random-unblocked/style.css` `.game-intro` block verbatim; keep Construct `#notSupported*` rules.

## appmanifest.json

```json
{
  "name": "{Title}",
  "short_name": "{ShortName}",
  "description": "{Short description}",
  "start_url": "index.html",
  "display": "fullscreen",
  "orientation": "any",
  "background_color": "#ffffff",
  "icons": []
}
```

## data.json Play event (Construct)

After simplification, Play actions should look like:

```json
[
  [60, 107, null, <sid>, 0, null],
  [6, 73, null, <sid>, 0, null, [[2, ["intro-sound", false]], [3, 0], [0, [4]], [1, [132]]]],
  [-1, 195, null, <sid>, 0, null, [[6, "game"]]]
]
```

- `60` = `play_intro_btn` (object index may differ — resolve by name)
- `107` = Hide / Destroy-as-hide action used in reference games
- `6` + `73` = Audio play `intro-sound`
- `-1` + `195` = Go to layout `"game"`

Object indices differ per export; always resolve names from `project[3][*][0]`.

## Hub wiring snippets

`scripts/rebuild-sitemap.py`:

```python
EXTRA_EN_PAGES = [
    # ...
    "<slug>",
]
```

Then: `python scripts/rebuild-sitemap.py`

`README.md` table row:

```markdown
| {Title} | [英语版](https://2048hub.com/<slug>/) | `<slug>/` | {中文一句说明} |
```
