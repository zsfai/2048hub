function SoundManager() {
  this.ctx = null;
  this.heartbeatInterval = null;
  this.enabled = true;
}

SoundManager.prototype.ensureContext = function () {
  if (!this.ctx) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
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
  gain.gain.value = volume || 0.08;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
};

SoundManager.prototype.playNoise = function (duration, volume) {
  var ctx = this.ensureContext();
  if (!ctx || !this.enabled) return;

  var bufferSize = ctx.sampleRate * duration;
  var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  var data = buffer.getChannelData(0);

  for (var i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  var source = ctx.createBufferSource();
  var gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = volume || 0.15;

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
};

SoundManager.prototype.levelUp = function () {
  var self = this;
  [523, 659, 784, 1047].forEach(function (freq, i) {
    setTimeout(function () {
      self.playTone(freq, 0.15, "triangle", 0.08);
    }, i * 90);
  });
};

SoundManager.prototype.achievement = function () {
  this.playTone(880, 0.1, "sine", 0.07);
  setTimeout(function () {
    this.playTone(1175, 0.2, "triangle", 0.08);
  }.bind(this), 100);
};

SoundManager.prototype.combo = function (level) {
  for (var i = 0; i < Math.min(level, 5); i++) {
    (function (idx) {
      setTimeout(function () {
        this.playTone(520 + idx * 90, 0.08, "triangle", 0.07);
      }.bind(this), idx * 70);
    }).call(this, i);
  }
};

SoundManager.prototype.traitorAlert = function () {
  var ctx = this.ensureContext();
  if (!ctx || !this.enabled) return;

  for (var i = 0; i < 4; i++) {
    (function (idx) {
      setTimeout(function () {
        this.playTone(880 + idx * 110, 0.12, "square", 0.06);
      }.bind(this), idx * 140);
    }).call(this, i);
  }
};

SoundManager.prototype.purify = function () {
  this.playTone(1200, 0.08, "sine", 0.07);
  setTimeout(function () {
    this.playTone(1800, 0.15, "triangle", 0.05);
    this.playNoise(0.2, 0.08);
  }.bind(this), 80);
};

SoundManager.prototype.explosion = function () {
  this.playNoise(0.6, 0.25);
  this.playTone(60, 0.5, "sawtooth", 0.12);
};

SoundManager.prototype.startHeartbeat = function () {
  this.stopHeartbeat();
  var beat = 0;
  var self = this;

  this.heartbeatInterval = setInterval(function () {
    beat++;
    var vol = 0.04 + beat * 0.008;
    self.playTone(55, 0.08, "sine", vol);
    setTimeout(function () {
      self.playTone(45, 0.06, "sine", vol * 0.8);
    }, 120);
  }, Math.max(280, 600 - beat * 20));
};

SoundManager.prototype.stopHeartbeat = function () {
  if (this.heartbeatInterval) {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }
};

SoundManager.prototype.checkUrgentHeartbeat = function (traitors) {
  var urgent = false;

  traitors.forEach(function (tile) {
    if (tile.getCountdownSeconds() <= 5 && tile.getCountdownSeconds() > 0) {
      urgent = true;
    }
  });

  if (urgent && !this.heartbeatInterval) {
    this.startHeartbeat();
  } else if (!urgent) {
    this.stopHeartbeat();
  }
};
