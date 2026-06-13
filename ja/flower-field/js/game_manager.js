function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size;
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.soundManager   = new SoundManager;

  this.startTiles     = 2;
  this.inputBlocked   = false;
  this.wishDropMode   = false;
  this.pendingMilestones = [];
  this.sessionMilestones = [];
  this.sessionNewNotebook = 0;
  this.highestBloom   = 0;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  var self = this;
  this.actuator.onWishDropToggle = function () {
    self.toggleWishDropMode();
  };
  this.actuator.onTileClick = function (x, y) {
    self.handleTileClick(x, y);
  };
  this.actuator.onMilestoneDismiss = function () {
    self.dismissMilestone();
  };

  this.setup();
}

GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame();
  this.pendingMilestones = [];
  this.sessionMilestones = [];
  this.sessionNewNotebook = 0;
  this.highestBloom = 0;
  this.inputBlocked = false;
  this.wishDropMode = false;
  this.setup();
};

GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame();
};

GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  if (previousState) {
    this.grid        = new Grid(previousState.grid.size, previousState.grid.cells);
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
    this.highestBloom = previousState.highestBloom || 0;
    this.sessionMilestones = previousState.sessionMilestones || [];
    this.sessionNewNotebook = previousState.sessionNewNotebook || 0;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.addStartTiles();
  }

  this.actuate();
  this.actuator.renderGarden(this.storageManager.getGarden());
  this.actuator.updateWishDrops(this.storageManager.getWishDrops());
  this.actuator.renderNotebook(this.storageManager.getNotebook());
  this.processMilestoneQueue();
};

GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);
    this.grid.insertTile(tile);
  }
};

GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  if (this.over) {
    this.storageManager.clearGameState();
  } else if (!this.inputBlocked) {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:              this.score,
    over:               this.over,
    won:                this.won,
    bestScore:          this.storageManager.getBestScore(),
    terminated:         this.isGameTerminated(),
    highestBloom:       this.highestBloom,
    sessionMilestones:  this.sessionMilestones,
    sessionNewNotebook: this.sessionNewNotebook,
    wishDropMode:       this.wishDropMode
  });
};

GameManager.prototype.serialize = function () {
  return {
    grid:               this.grid.serialize(),
    score:              this.score,
    over:               this.over,
    won:                this.won,
    keepPlaying:        this.keepPlaying,
    highestBloom:       this.highestBloom,
    sessionMilestones:  this.sessionMilestones,
    sessionNewNotebook: this.sessionNewNotebook
  };
};

GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

GameManager.prototype.move = function (direction) {
  var self = this;

  if (this.isGameTerminated() || this.inputBlocked || this.wishDropMode) return;

  var cell, tile;
  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;
  var mergedValues = [];

  this.prepareTiles();

  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);
          tile.updatePosition(positions.next);

          self.score += merged.value;
          mergedValues.push(merged.value);

          if (merged.value > self.highestBloom) {
            self.highestBloom = merged.value;
          }
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true;
        }
      }
    });
  });

  if (moved) {
    this.soundManager.move();
    mergedValues.forEach(function (value) {
      self.soundManager.merge();
      if (FlowerConfig.isMilestone(value)) {
        self.handleMilestone(value);
      }
    });

    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true;
    }

    this.actuate();
    this.processMilestoneQueue();
  }
};

GameManager.prototype.handleMilestone = function (value) {
  var stage = FlowerConfig.getStage(value);
  var already = this.sessionMilestones.some(function (m) { return m.value === value; });
  if (!already) {
    this.sessionMilestones.push({ value: value, name: stage.name });
    this.sessionMilestones.sort(function (a, b) { return a.value - b.value; });
  }

  var entry = {
    value: value,
    name: stage.name,
    message: FlowerConfig.getMessage(value),
    date: new Date().toISOString()
  };

  var isNewFlower = this.storageManager.addNotebookEntry(entry);

  if (isNewFlower) {
    this.sessionNewNotebook += 1;
    var drops = this.storageManager.getWishDrops() + 1;
    this.storageManager.setWishDrops(drops);
    this.actuator.updateWishDrops(drops);
    this.storageManager.unlockGardenFlower(value);
    this.actuator.renderGarden(this.storageManager.getGarden());
    this.actuator.renderNotebook(this.storageManager.getNotebook());

    if (this.pendingMilestones.indexOf(value) === -1) {
      this.pendingMilestones.push(value);
    }
  }
};

GameManager.prototype.processMilestoneQueue = function () {
  if (this.inputBlocked || this.pendingMilestones.length === 0) return;

  var value = this.pendingMilestones.shift();
  this.inputBlocked = true;
  this.soundManager.bloom();
  this.actuator.showFlowerMessage({
    value: value,
    stage: FlowerConfig.getStage(value),
    message: FlowerConfig.getMessage(value),
    isNew: this.storageManager.getNotebook().some(function (e) { return e.value === value; })
  });
};

GameManager.prototype.dismissMilestone = function () {
  this.inputBlocked = false;
  if (!this.over) {
    this.storageManager.setGameState(this.serialize());
  }
  this.processMilestoneQueue();
};

GameManager.prototype.toggleWishDropMode = function () {
  if (this.isGameTerminated() || this.inputBlocked) return;
  var drops = this.storageManager.getWishDrops();
  if (drops <= 0) return;

  this.wishDropMode = !this.wishDropMode;
  this.actuator.setWishDropMode(this.wishDropMode);
};

GameManager.prototype.handleTileClick = function (x, y) {
  if (!this.wishDropMode || this.isGameTerminated() || this.inputBlocked) return;

  var cell = { x: x, y: y };
  var tile = this.grid.cellContent(cell);
  if (!tile) return;

  tile.value = 2;
  this.wishDropMode = false;
  var drops = this.storageManager.getWishDrops() - 1;
  this.storageManager.setWishDrops(drops);
  this.soundManager.wishDrop();
  this.actuator.updateWishDrops(drops);
  this.actuator.setWishDropMode(false);
  this.actuate();
};

GameManager.prototype.getVector = function (direction) {
  var map = {
    0: { x: 0,  y: -1 },
    1: { x: 1,  y: 0 },
    2: { x: 0,  y: 1 },
    3: { x: -1, y: 0 }
  };
  return map[direction];
};

GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };
  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

  return { farthest: previous, next: cell };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;
  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });
      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };
          var other  = self.grid.cellContent(cell);
          if (other && other.value === tile.value) return true;
        }
      }
    }
  }
  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
