/* Offline PokiSDK stub + sitelock neuter for hub hosting.
 *
 * Monkey Mart runs Poki sitelock via Defold html5.run() -> eval().
 * On non-Poki domains that redirects to https://poki.com/sitelock.
 * Bypass (no ad CDN): rewrite eval payloads, spoof hostname, block nav/network.
 */
(function () {
  "use strict";

  document.xURL = "https://poki.com/";

  var SITELOCK_B64 = "aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==";
  /* "#" — if redirect still fires, stay on-page */
  var SITELOCK_B64_SAFE = "Iw==";

  function isPokiHost(url) {
    try {
      var u = new URL(String(url), location.href);
      return /(^|\.)poki\.(com|io)$/i.test(u.hostname);
    } catch (e) {
      return /poki\.(com|io)/i.test(String(url || ""));
    }
  }

  function isBlockedNav(url) {
    if (url == null) return false;
    var s = String(url);
    if (/poki\.com\/sitelock/i.test(s)) return true;
    return isPokiHost(s);
  }

  function neuterSitelockCode(code) {
    if (typeof code !== "string") return code;
    code = code.split(SITELOCK_B64).join(SITELOCK_B64_SAFE);
    code = code.replace(/https?:\/\/(?:www\.)?poki\.com\/sitelock\/?/gi, "#");
    /* Quoted location keys used by obfuscated sitelock */
    code = code.replace(/(['"])location\1/g, "$1xlocation$1");
    /* Known Monkey Mart / ubg235 sitelock assignment patterns */
    code = code.split("] = _0x3296f7;").join("]==_0x3296f7;");
    code = code.split("] = window[_0xcdc9(").join("]==window[_0xcdc9(");
    return code;
  }

  /* Spoofed location when sitelock is rewritten to read xlocation */
  window.xlocation = new Proxy(location, {
    get: function (target, property) {
      var val = target[property];
      if (typeof val === "function") {
        return function () {
          return val.apply(target, arguments);
        };
      }
      if (property === "host" || property === "hostname") return "poki.com";
      if (property === "href") return "https://poki.com/";
      if (property === "origin") return "https://poki.com";
      if (property === "protocol") return "https:";
      if (property === "pathname") return "/";
      return val;
    },
    set: function () {
      return true;
    }
  });

  var originalEval = window.eval;
  window.eval = function () {
    if (typeof arguments[0] === "string") {
      arguments[0] = neuterSitelockCode(arguments[0]);
    }
    return originalEval.apply(this, arguments);
  };

  var OriginalFunction = window.Function;
  window.Function = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args.length) {
      args[args.length - 1] = neuterSitelockCode(String(args[args.length - 1]));
    }
    return OriginalFunction.apply(this, args);
  };
  window.Function.prototype = OriginalFunction.prototype;

  var originalOpen = window.open;
  window.open = function (url) {
    if (isBlockedNav(url)) return null;
    return originalOpen.apply(this, arguments);
  };

  try {
    if (navigator.sendBeacon) {
      var originalBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        if (isPokiHost(url) || isBlockedNav(url)) return true;
        return originalBeacon(url, data);
      };
    }
  } catch (e) {}

  try {
    var locProto = Location.prototype;
    var desc = Object.getOwnPropertyDescriptor(locProto, "href");
    if (desc && desc.set) {
      Object.defineProperty(locProto, "href", {
        configurable: true,
        enumerable: true,
        get: desc.get,
        set: function (v) {
          if (isBlockedNav(v)) return;
          return desc.set.call(this, v);
        }
      });
    }
    ["assign", "replace"].forEach(function (method) {
      var orig = locProto[method];
      if (typeof orig !== "function") return;
      locProto[method] = function (url) {
        if (isBlockedNav(url)) return;
        return orig.call(this, url);
      };
    });
  } catch (e) {}

  /* Block late injection of real Poki SDK scripts */
  try {
    var originalCreateElement = Document.prototype.createElement;
    Document.prototype.createElement = function (tagName, options) {
      var el = originalCreateElement.call(this, tagName, options);
      if (String(tagName).toLowerCase() === "script") {
        var descSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
        if (descSrc && descSrc.set) {
          Object.defineProperty(el, "src", {
            configurable: true,
            enumerable: true,
            get: function () {
              return descSrc.get.call(this);
            },
            set: function (v) {
              if (isPokiHost(v)) return;
              return descSrc.set.call(this, v);
            }
          });
        }
      }
      return el;
    };
  } catch (e) {}

  /* Drop fetch/XHR to Poki backends */
  try {
    if (window.fetch) {
      var originalFetch = window.fetch.bind(window);
      window.fetch = function (input, init) {
        var url = typeof input === "string" ? input : input && input.url;
        if (isPokiHost(url)) {
          return Promise.resolve(
            new Response("{}", {
              status: 200,
              headers: { "Content-Type": "application/json" }
            })
          );
        }
        return originalFetch(input, init);
      };
    }
    var OriginalXHR = window.XMLHttpRequest;
    if (OriginalXHR) {
      window.XMLHttpRequest = function () {
        var xhr = new OriginalXHR();
        var open = xhr.open;
        xhr.open = function (method, url) {
          if (isPokiHost(url)) {
            arguments[1] = "data:application/json,{}";
          }
          return open.apply(this, arguments);
        };
        return xhr;
      };
      window.XMLHttpRequest.prototype = OriginalXHR.prototype;
    }
  } catch (e) {}

  function PokiSDK() {
    this.getURLParam = function () {
      return "";
    };
    this.init = function () {
      return Promise.resolve("InitDone");
    };
    this.setDebug = function () {};
    this.setDebugTouchOverlayController = function () {};
    this.isAdBlocked = function () {
      return false;
    };
    this.happyTime = function () {};
    this.gameLoadingStart = function () {};
    this.gameLoadingProgress = function () {};
    this.gameLoadingFinished = function () {};
    this.gameplayStart = function () {};
    this.gameplayStop = function () {};
    this.commercialBreak = function () {
      return Promise.resolve();
    };
    this.rewardedBreak = function () {
      return Promise.resolve(true);
    };
    this.displayAd = function () {};
    this.destroyAd = function () {};
    this.captureError = function () {};
    this.shareableURL = function () {
      return Promise.resolve(location.href);
    };
  }

  PokiSDK.prototype.initWithVideoHB = function () {
    return Promise.resolve("");
  };

  PokiSDK.prototype.customEvent = function () {};

  window.PokiSDK = new PokiSDK();
})();
