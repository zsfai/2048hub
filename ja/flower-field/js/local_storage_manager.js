window.fakeStorage = {
  _data: {},
  setItem: function (id, val) { return this._data[id] = String(val); },
  getItem: function (id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
  removeItem: function (id) { return delete this._data[id]; },
  clear: function () { return this._data = {}; }
};

function LocalStorageManager() {
  this.prefix = "flowerfield_ja_";
  this.bestScoreKey = this.prefix + "bestScore";
  this.gameStateKey = this.prefix + "gameState";
  this.notebookKey = this.prefix + "notebook";
  this.wishDropsKey = this.prefix + "wishDrops";
  this.gardenKey = this.prefix + "garden";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  try {
    var storage = window.localStorage;
    storage.setItem("test", "1");
    storage.removeItem("test");
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

LocalStorageManager.prototype.getNotebook = function () {
  var raw = this.storage.getItem(this.notebookKey);
  return raw ? JSON.parse(raw) : [];
};

LocalStorageManager.prototype.addNotebookEntry = function (entry) {
  var book = this.getNotebook();
  if (book.some(function (e) { return e.value === entry.value; })) {
    return false;
  }
  book.push(entry);
  book.sort(function (a, b) { return a.value - b.value; });
  this.storage.setItem(this.notebookKey, JSON.stringify(book));
  return true;
};

LocalStorageManager.prototype.getWishDrops = function () {
  return parseInt(this.storage.getItem(this.wishDropsKey), 10) || 0;
};

LocalStorageManager.prototype.setWishDrops = function (count) {
  this.storage.setItem(this.wishDropsKey, Math.max(0, count));
};

LocalStorageManager.prototype.getGarden = function () {
  var raw = this.storage.getItem(this.gardenKey);
  return raw ? JSON.parse(raw) : [];
};

LocalStorageManager.prototype.unlockGardenFlower = function (value) {
  var garden = this.getGarden();
  if (garden.indexOf(value) === -1) {
    garden.push(value);
    garden.sort(function (a, b) { return a - b; });
    this.storage.setItem(this.gardenKey, JSON.stringify(garden));
  }
};
