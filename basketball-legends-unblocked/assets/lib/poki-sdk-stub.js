/* Minimal PokiSDK stub for offline / hub play — no ad network calls. */
document.xURL = "https://poki.com/";

function PokiSDK() {
  this.getURLParam = function () { return ""; };
  this.init = function () { return Promise.resolve("InitDone"); };
  this.setDebug = function () {};
  this.setDebugTouchOverlayController = function () {};
  this.isAdBlocked = function () { return false; };
  this.happyTime = function () {};
  this.gameLoadingStart = function () {};
  this.gameLoadingProgress = function () {};
  this.gameLoadingFinished = function () {};
  this.gameplayStart = function () {};
  this.gameplayStop = function () {};
  this.commercialBreak = function () { return Promise.resolve(); };
  this.rewardedBreak = function () { return Promise.resolve(false); };
  this.displayAd = function () {};
  this.destroyAd = function () {};
}

PokiSDK.prototype.initWithVideoHB = function () {
  return Promise.resolve("");
};

PokiSDK.prototype.customEvent = function () {};

window.PokiSDK = new PokiSDK();
