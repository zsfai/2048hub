window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.prefix           = "ark2048en_";
  this.bestScoreKey     = this.prefix + "bestScore";
  this.gameStateKey     = this.prefix + "gameState";
  this.maxPurifyKey     = this.prefix + "maxPurify";
  this.leaderboardKey   = this.prefix + "leaderboard";
  this.playerProfileKey = this.prefix + "playerProfile";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

LocalStorageManager.prototype.getBestScore = function () {
  return parseInt(this.storage.getItem(this.bestScoreKey), 10) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

LocalStorageManager.prototype.getMaxPurify = function () {
  return parseInt(this.storage.getItem(this.maxPurifyKey), 10) || 0;
};

LocalStorageManager.prototype.setMaxPurify = function (level) {
  if (level > this.getMaxPurify()) {
    this.storage.setItem(this.maxPurifyKey, level);
  }
};

LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

LocalStorageManager.prototype.getTodayKey = function () {
  var d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
};

LocalStorageManager.prototype.getLeaderboard = function () {
  var raw = this.storage.getItem(this.leaderboardKey);
  var data = raw ? JSON.parse(raw) : { entries: [] };
  var today = this.getTodayKey();

  if (data.date !== today) {
    data = { date: today, entries: [] };
    this.storage.setItem(this.leaderboardKey, JSON.stringify(data));
  }

  return data;
};

LocalStorageManager.prototype.addLeaderboardEntry = function (name, score, maxPurify) {
  var board = this.getLeaderboard();
  board.entries.push({
    name: name || "Anonymous Captain",
    score: score,
    maxPurify: maxPurify,
    time: Date.now()
  });

  board.entries.sort(function (a, b) {
    if (b.maxPurify !== a.maxPurify) return b.maxPurify - a.maxPurify;
    return b.score - a.score;
  });

  board.entries = board.entries.slice(0, 10);
  this.storage.setItem(this.leaderboardKey, JSON.stringify(board));
  return board;
};

LocalStorageManager.prototype.getTitleForLevel = function (level) {
  if (level >= 1024) return "Deity";
  if (level >= 512) return "Ark Captain";
  if (level >= 256) return "Apocalypse Engineer";
  if (level >= 128) return "Bomb Expert";
  if (level >= 64) return "Rookie Defuser";
  return null;
};

LocalStorageManager.prototype.getPlayerProfile = function () {
  var raw = this.storage.getItem(this.playerProfileKey);
  if (!raw) {
    return {
      xp: 0,
      level: 1,
      currentChapter: 1,
      maxChapterReached: 1,
      chapterStars: {},
      achievements: [],
      lastLoginDate: "",
      loginStreak: 0,
      dailyClaimed: false,
      totalGames: 0,
      lifetimePurifies: 0,
      lifetimeScore: 0
    };
  }
  return JSON.parse(raw);
};

LocalStorageManager.prototype.setPlayerProfile = function (profile) {
  this.storage.setItem(this.playerProfileKey, JSON.stringify(profile));
};
