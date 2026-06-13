function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size;
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.rewardSystem   = new RewardSystem(this.storageManager);
  this.actuator       = new Actuator;
  this.actuator.bindRewardSystem(this.rewardSystem);
  this.sound          = new SoundManager;

  this.startTiles     = 2;
  this.maxPurifyLevel = 0;
  this.moveCount      = 0;
  this.arkHull        = 100;
  this.purifyCombo    = 0;
  this.tickTimer      = null;
  this.sessionStats   = this.rewardSystem.createSessionStats();
  this.missionComplete = false;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  this.setup();
  this.startTickLoop();
}

GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame();
  this.maxPurifyLevel = 0;
  this.moveCount      = 0;
  this.arkHull        = 100;
  this.purifyCombo    = 0;
  this.sessionStats   = this.rewardSystem.createSessionStats();
  this.missionComplete = false;
  this.setup();
};

GameManager.prototype.isGameTerminated = function () {
  return this.over;
};

GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  if (previousState) {
    this.grid            = new Grid(previousState.grid.size, previousState.grid.cells);
    this.score           = previousState.score;
    this.over            = previousState.over;
    this.maxPurifyLevel  = previousState.maxPurifyLevel || 0;
    this.moveCount       = previousState.moveCount || 0;
    this.arkHull         = previousState.arkHull !== undefined ? previousState.arkHull : 100;
    this.purifyCombo     = previousState.purifyCombo || 0;
    this.sessionStats    = previousState.sessionStats || this.rewardSystem.createSessionStats();
    this.missionComplete = previousState.missionComplete || false;
  } else {
    this.grid            = new Grid(this.size);
    this.score           = 0;
    this.over            = false;
    this.maxPurifyLevel  = 0;
    this.moveCount       = 0;
    this.arkHull         = 100;
    this.purifyCombo     = 0;
    this.sessionStats   = this.rewardSystem.createSessionStats();
    this.missionComplete = false;
    this.addStartTiles();
  }

  this.syncSessionStats();
  this.actuate();
};

GameManager.prototype.syncSessionStats = function () {
  this.sessionStats.score = this.score;
  this.sessionStats.arkHull = this.arkHull;
  this.sessionStats.maxPurifyLevel = this.maxPurifyLevel;
  this.sessionStats.moveCount = this.moveCount;
  this.sessionStats.maxCombo = Math.max(this.sessionStats.maxCombo, this.purifyCombo);
};

GameManager.prototype.startTickLoop = function () {
  var self = this;

  if (this.tickTimer) clearInterval(this.tickTimer);

  this.tickTimer = setInterval(function () {
    if (self.over) return;
    self.onTick();
  }, 250);
};

GameManager.prototype.onTick = function () {
  var self = this;
  var traitors = this.getTraitors();
  var exploded = false;

  traitors.forEach(function (tile) {
    if (tile.getCountdownSeconds() <= 0) {
      self.explodeTraitor(tile);
      exploded = true;
    }
  });

  if (exploded) {
    self.checkGameOver();
    self.actuate({
      explosion: true,
      hullDamage: self.lastHullDamage || 0
    });
    self.lastHullDamage = 0;
    return;
  }

  this.sound.checkUrgentHeartbeat(traitors);
  this.actuator.updateCountdowns(this.grid, this.grid.countTraitors(), this.arkHull);
};

GameManager.prototype.getTraitors = function () {
  var traitors = [];

  this.grid.eachCell(function (x, y, tile) {
    if (tile && tile.isTraitor()) traitors.push(tile);
  });

  return traitors;
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

GameManager.prototype.actuate = function (extra) {
  extra = extra || {};

  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  if (this.maxPurifyLevel > 0) {
    this.storageManager.setMaxPurify(this.maxPurifyLevel);
  }

  if (this.over) {
    this.storageManager.clearGameState();
    this.sound.stopHeartbeat();
    extra.gameRewards = this.rewardSystem.onGameOver(this.sessionStats);
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.syncSessionStats();
  var chapter = this.rewardSystem.getChapter();
  var mission = this.rewardSystem.getMissionProgress(chapter.id, this.sessionStats);

  this.actuator.actuate(this.grid, {
    score:          this.score,
    over:           this.over,
    bestScore:      this.storageManager.getBestScore(),
    maxPurifyLevel: this.maxPurifyLevel,
    allTimeMaxPurify: this.storageManager.getMaxPurify(),
    title:          this.storageManager.getTitleForLevel(this.maxPurifyLevel),
    traitorCount:   this.grid.countTraitors(),
    arkHull:        this.arkHull,
    purifyCombo:    this.purifyCombo,
    moveCount:      this.moveCount,
    terminated:     this.isGameTerminated(),
    purified:       extra.purified || false,
    purifyComboHit: extra.purifyComboHit || 0,
    perfectDefuse:  extra.perfectDefuse || false,
    timeBonus:      extra.timeBonus || false,
    explosion:      extra.explosion || false,
    betrayed:       extra.betrayed || false,
    hullDamage:     extra.hullDamage || 0,
    xpEvents:       extra.xpEvents || [],
    missionComplete: extra.missionComplete || false,
    mission:        mission,
    chapter:        chapter,
    playerProgress: this.rewardSystem.getLevelProgress(),
    gameRewards:    extra.gameRewards || null
  });
};

GameManager.prototype.serialize = function () {
  return {
    grid: {
      size: this.grid.size,
      cells: this.grid.serialize().cells
    },
    score: this.score,
    over: this.over,
    maxPurifyLevel: this.maxPurifyLevel,
    moveCount: this.moveCount,
    arkHull: this.arkHull,
    purifyCombo: this.purifyCombo,
    sessionStats: this.sessionStats,
    missionComplete: this.missionComplete
  };
};

GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.purified = false;
      tile.savePosition();
    }
  });
};

GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

GameManager.prototype.purifyTiles = function (tile, next) {
  var traitorTile = next.isTraitor() ? next : tile;
  var keeperTile  = traitorTile === next ? tile : next;
  var mergePos    = { x: traitorTile.x, y: traitorTile.y };
  var value       = traitorTile.value;
  var secondsLeft = traitorTile.getCountdownSeconds();

  this.grid.removeTile(traitorTile);
  this.grid.removeTile(keeperTile);

  keeperTile.traitor = false;
  keeperTile.betrayAt = null;
  keeperTile.deadline = null;
  keeperTile.purified = true;
  keeperTile.updatePosition(mergePos);
  this.grid.insertTile(keeperTile);

  this.purifyCombo++;
  var comboMultiplier = 1 + (this.purifyCombo - 1) * 0.5;
  var baseScore = Math.floor(value * 3 * comboMultiplier);
  var perfectDefuse = secondsLeft >= 20;
  if (perfectDefuse) {
    baseScore = Math.floor(baseScore * 1.5);
  }

  this.score += baseScore;

  if (value > this.maxPurifyLevel) {
    this.maxPurifyLevel = value;
  }

  this.extendOtherTraitors([], 12);
  this.arkHull = Math.min(100, this.arkHull + 8);

  this.sessionStats.purifyCount += 1;
  if (perfectDefuse) this.sessionStats.perfectCount += 1;
  this.sessionStats.maxCombo = Math.max(this.sessionStats.maxCombo, this.purifyCombo);
  this.syncSessionStats();

  this.sound.purify();
  if (this.purifyCombo > 1) {
    this.sound.combo(this.purifyCombo);
  }

  return {
    combo: this.purifyCombo,
    perfectDefuse: perfectDefuse,
    scoreGained: baseScore,
    xpResult: null
  };
};

GameManager.prototype.extendOtherTraitors = function (exclude, seconds) {
  this.grid.eachCell(function (x, y, cell) {
    if (!cell || !cell.isTraitor()) return;
    if (exclude.indexOf(cell) !== -1) return;
    cell.extendDeadline(seconds);
  });
};

GameManager.prototype.applyBetrayals = function () {
  var betrayed = false;

  this.grid.eachCell(function (x, y, tile) {
    if (tile && !tile.isTraitor() && tile.value >= Tile.BETRAY_THRESHOLD &&
        tile.betrayAt !== null && tile.betrayAt <= this.moveCount) {
      Tile.makeTraitor(tile);
      betrayed = true;
    }
  }.bind(this));

  if (betrayed) {
    this.sound.traitorAlert();
  }

  return betrayed;
};

GameManager.prototype.markForBetrayal = function (tile) {
  Tile.markForBetrayal(tile, this.moveCount);
};

GameManager.prototype.explodeTraitor = function (tile) {
  var x = tile.x;
  var y = tile.y;
  var toRemove = {};
  var damage = Tile.getExplosionDamage(tile.value);

  this.grid.eachCell(function (cx, cy, cell) {
    if (cell && (cx === x || cy === y)) {
      toRemove[cx + "," + cy] = cell;
    }
  });

  for (var key in toRemove) {
    this.grid.removeTile(toRemove[key]);
  }

  this.arkHull = Math.max(0, this.arkHull - damage);
  this.purifyCombo = 0;
  this.lastHullDamage = damage;
  this.sound.explosion();
};

GameManager.prototype.checkGameOver = function () {
  if (this.arkHull <= 0) {
    this.over = true;
    return;
  }

  if (!this.grid.cellsAvailable()) {
    var allTraitors = true;

    this.grid.eachCell(function (x, y, tile) {
      if (!tile || !tile.isTraitor()) {
        allTraitors = false;
      }
    });

    if (allTraitors) {
      this.over = true;
      return;
    }
  }

  if (!this.movesAvailable()) {
    this.over = true;
  }
};

GameManager.prototype.move = function (direction) {
  var self = this;

  if (this.isGameTerminated()) return;

  this.moveCount++;
  var betrayedAtStart = this.applyBetrayals();

  var cell, tile;
  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;
  var purified   = false;
  var purifyMeta = null;

  this.prepareTiles();

  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile && !tile.isTraitor()) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        if (next && next.value === tile.value && !next.mergedFrom && !tile.mergedFrom) {
          if (next.isTraitor() || tile.isTraitor()) {
            purifyMeta = self.purifyTiles(tile, next);
            purified = true;
            moved = true;
          } else {
            var merged = new Tile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next];

            self.grid.insertTile(merged);
            self.grid.removeTile(tile);
            tile.updatePosition(positions.next);

            self.score += merged.value;
            self.markForBetrayal(merged);
            self.sessionStats.score = self.score;
          }
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
    if (!purified) {
      this.purifyCombo = 0;
    }

    this.addRandomTile();
    this.checkGameOver();
    this.syncSessionStats();

    var xpEvents = [];
    var missionCompleteEvent = null;

    if (purified && purifyMeta) {
      var xpResult = this.rewardSystem.onPurify(purifyMeta, this.sessionStats);
      purifyMeta.xpResult = xpResult;
      xpEvents.push({ type: "xp", amount: xpResult.amount, bonuses: xpResult.bonuses });
      if (xpResult.events.length) {
        xpEvents = xpEvents.concat(xpResult.events);
      }

      missionCompleteEvent = this.rewardSystem.checkMissionComplete(
        this.rewardSystem.getProfile().currentChapter,
        this.sessionStats,
        this.missionComplete
      );

      if (missionCompleteEvent) {
        this.missionComplete = true;
        xpEvents.push(missionCompleteEvent);
        if (missionCompleteEvent.events) {
          xpEvents = xpEvents.concat(missionCompleteEvent.events);
        }
        this.sound.levelUp();
      }
    } else {
      var mergeXP = this.rewardSystem.onMerge();
      if (mergeXP.amount > 0) {
        xpEvents.push({ type: "xp", amount: mergeXP.amount });
      }
    }

    this.actuate({
      purified: purified,
      purifyComboHit: purifyMeta ? purifyMeta.combo : 0,
      perfectDefuse: purifyMeta ? purifyMeta.perfectDefuse : false,
      timeBonus: purified,
      betrayed: betrayedAtStart,
      hullDamage: this.lastHullDamage || 0,
      xpEvents: xpEvents,
      missionComplete: !!missionCompleteEvent
    });

    this.lastHullDamage = 0;
  }
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
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell
  };
};

GameManager.prototype.movesAvailable = function () {
  if (this.grid.cellsAvailable()) return true;
  return this.tileMatchesAvailable();
};

GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var tile = self.grid.cellContent({ x: x, y: y });

      if (tile && !tile.isTraitor()) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };
          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.nextChapter = function () {
  var profile = this.rewardSystem.getProfile();
  if (profile.currentChapter < profile.maxChapterReached) {
    this.rewardSystem.setChapter(profile.currentChapter + 1);
  }
  this.restart();
};

GameManager.prototype.selectChapter = function (chapterId) {
  this.rewardSystem.setChapter(chapterId);
  this.restart();
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
