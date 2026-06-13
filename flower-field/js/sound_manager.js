function SoundManager() {
  this.ctx = null;
  this.enabled = true;
}

SoundManager.prototype.ensureContext = function () {
  if (!this.ctx) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) this.ctx = new AudioContext();
  }
  if (this.ctx && this.ctx.state === "suspended") {
    this.ctx.resume();
  }
  return this.ctx;
};

SoundManager.prototype.playTone = function (freq, duration, type, volume) {
  var ctx = this.ensureContext();
  if (!ctx || !this.enabled) return;

  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.value = volume || 0.06;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
};

SoundManager.prototype.move = function () {
  this.playTone(420, 0.05, "sine", 0.04);
};

SoundManager.prototype.merge = function () {
  this.playTone(660, 0.08, "triangle", 0.05);
  setTimeout(function () {
    this.playTone(880, 0.12, "sine", 0.04);
  }.bind(this), 60);
};

SoundManager.prototype.bloom = function () {
  this.playTone(523, 0.1, "sine", 0.06);
  setTimeout(function () {
    this.playTone(659, 0.15, "triangle", 0.05);
    this.playTone(784, 0.2, "sine", 0.04);
  }.bind(this), 100);
};

SoundManager.prototype.wishDrop = function () {
  this.playTone(980, 0.08, "sine", 0.05);
};
