function Tile(position, value, options) {
  options = options || {};
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;
  this.traitor          = !!options.traitor;
  this.deadline         = options.deadline || null;
  this.betrayAt         = options.betrayAt || null;

  this.previousPosition = null;
  this.mergedFrom       = null;
  this.purified         = false;
}

// Traitor bombs from 64+; higher values get longer countdowns
Tile.BETRAY_THRESHOLD = 64;
Tile.BETRAY_GRACE_TURNS = 5;

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.isTraitor = function () {
  return this.traitor;
};

Tile.prototype.getCountdownSeconds = function () {
  if (!this.traitor || !this.deadline) return 0;
  return Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
};

Tile.prototype.getTurnsUntilBetrayal = function (moveCount) {
  if (this.traitor || this.betrayAt === null) return null;
  return Math.max(0, this.betrayAt - moveCount);
};

Tile.prototype.extendDeadline = function (seconds) {
  if (!this.traitor || !this.deadline) return;

  this.deadline += seconds * 1000;
  var cap = Date.now() + Tile.getTraitorCountdown(this.value) * 2000;
  if (this.deadline > cap) {
    this.deadline = cap;
  }
};

Tile.prototype.serialize = function () {
  return {
    position: { x: this.x, y: this.y },
    value: this.value,
    traitor: this.traitor,
    deadline: this.deadline,
    betrayAt: this.betrayAt
  };
};

Tile.getTraitorCountdown = function (value) {
  if (value >= 2048) return 200;
  if (value >= 1024) return 165;
  if (value >= 512) return 135;
  if (value >= 256) return 110;
  if (value >= 128) return 90;
  if (value >= 64) return 70;
  return 0;
};

Tile.getExplosionDamage = function (value) {
  if (value >= 1024) return 18;
  if (value >= 512) return 14;
  if (value >= 256) return 12;
  if (value >= 128) return 10;
  if (value >= 64) return 8;
  return 8;
};

Tile.makeTraitor = function (tile) {
  var seconds = Tile.getTraitorCountdown(tile.value);
  tile.traitor = true;
  tile.deadline = Date.now() + seconds * 1000;
  tile.betrayAt = null;
  return tile;
};

Tile.markForBetrayal = function (tile, moveCount) {
  if (tile.value >= Tile.BETRAY_THRESHOLD && !tile.isTraitor()) {
    tile.betrayAt = moveCount + Tile.BETRAY_GRACE_TURNS + 1;
  }
};

Tile.renderTraitorInner = function (tile) {
  var seconds = tile.getCountdownSeconds();
  return '<span class="traitor-value">' + tile.value + '</span>' +
         '<span class="traitor-timer">' + seconds + 's</span>';
};

Tile.updateTraitorTimer = function (inner, tile) {
  var timer = inner.querySelector(".traitor-timer");
  if (timer) {
    timer.textContent = tile.getCountdownSeconds() + "s";
  }
};
