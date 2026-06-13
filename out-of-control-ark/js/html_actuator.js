function HTMLActuator() {
  this.tileContainer      = document.querySelector(".tile-container");
  this.scoreContainer     = document.querySelector(".score-container");
  this.bestContainer      = document.querySelector(".best-container");
  this.purifyContainer    = document.querySelector(".purify-container");
  this.messageContainer   = document.querySelector(".game-message");
  this.leaderboardList    = document.querySelector(".leaderboard-list");
  this.shareCanvas        = document.querySelector("#share-canvas");
  this.body               = document.body;
  this.hullBar            = document.querySelector(".hull-bar-fill");
  this.hullValue          = document.querySelector(".hull-value");
  this.comboLayer         = document.querySelector(".combo-layer");
  this.gameContainer      = document.querySelector(".game-container");
  this.playerLevelEl      = document.querySelector(".player-level");
  this.playerTitleEl      = document.querySelector(".player-title");
  this.xpBarFill          = document.querySelector(".xp-bar-fill");
  this.xpCurrentEl        = document.querySelector(".xp-current");
  this.xpNeedEl           = document.querySelector(".xp-need");
  this.chapterTitleEl     = document.querySelector(".chapter-title");
  this.chapterStarsEl     = document.querySelector(".chapter-stars-display");
  this.missionTextEl      = document.querySelector(".mission-text");
  this.missionBarFill     = document.querySelector(".mission-bar-fill");
  this.missionCountEl     = document.querySelector(".mission-count");
  this.chapterMapEl       = document.querySelector(".chapter-map");
  this.achievementGrid    = document.querySelector(".achievement-grid");
  this.rewardOverlay      = document.querySelector(".reward-overlay");
  this.rewardTitleEl      = document.querySelector(".reward-title");
  this.rewardDescEl       = document.querySelector(".reward-desc");
  this.rewardXpEl         = document.querySelector(".reward-xp");
  this.nextChapterBtn     = document.querySelector(".next-chapter-button");

  this.score = 0;
  this.storageManager = new LocalStorageManager();
  this.rewardSystem = null;
  this.pendingRewards = [];
}

HTMLActuator.prototype.bindRewardSystem = function (rewardSystem) {
  this.rewardSystem = rewardSystem;
};

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.currentMoveCount = metadata.moveCount || 0;
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
    self.updatePurifyLevel(metadata.maxPurifyLevel);
    self.updateHull(metadata.arkHull, metadata.hullDamage);
    self.updateBackground(metadata.traitorCount || 0);
    self.updatePlayerProgress(metadata.playerProgress);
    self.updateMissionPanel(metadata.chapter, metadata.mission);

    if (metadata.xpEvents && metadata.xpEvents.length) {
      metadata.xpEvents.forEach(function (evt) {
        if (evt.type === "xp") {
          self.showXPFloater("+" + evt.amount + " XP");
        } else if (evt.type === "levelUp") {
          self.queueReward({
            icon: "⬆️",
            title: "Rank up!",
            desc: "Lv." + evt.level + " · " + evt.title,
            xp: ""
          });
        } else if (evt.type === "missionComplete") {
          self.queueReward({
            icon: "🎯",
            title: "Mission complete!",
            desc: evt.chapter.name + " objective cleared",
            xp: "+" + evt.amount + " XP"
          });
        }
      });
    }

    if (metadata.missionComplete) {
      self.showToast("Mission complete!", "mission-done");
    }

    if (metadata.purified && metadata.purifyComboHit > 1) {
      self.showCombo(metadata.purifyComboHit, metadata.perfectDefuse);
    } else if (metadata.purified && metadata.perfectDefuse) {
      self.showCombo(1, true);
    }

    if (metadata.timeBonus) {
      self.showToast("Other bombs +12s", "time-bonus");
    }

    if (metadata.betrayed) {
      self.body.classList.add("alarm-flash");
      setTimeout(function () {
        self.body.classList.remove("alarm-flash");
      }, 600);
    }

    if (metadata.purified) {
      self.body.classList.add("purify-flash");
      setTimeout(function () {
        self.body.classList.remove("purify-flash");
      }, 400);
    }

    if (metadata.explosion) {
      self.body.classList.add("explosion-shake");
      setTimeout(function () {
        self.body.classList.remove("explosion-shake");
      }, 500);
    }

    if (metadata.terminated && metadata.over) {
      self.showGameOver(metadata);
    }

    if (self.rewardSystem) {
      self.updatePlayerProgress(self.rewardSystem.getLevelProgress());
    }

    self.flushRewardQueue();
  });
};

HTMLActuator.prototype.updateCountdowns = function (grid, traitorCount, arkHull) {
  var self = this;
  var wrappers = this.tileContainer.querySelectorAll(".tile.traitor");

  wrappers.forEach(function (wrapper) {
    var x = parseInt(wrapper.getAttribute("data-x"), 10);
    var y = parseInt(wrapper.getAttribute("data-y"), 10);
    var tile = grid.cellContent({ x: x, y: y });

    if (tile && tile.isTraitor()) {
      var inner = wrapper.querySelector(".tile-inner");
      var seconds = tile.getCountdownSeconds();
      Tile.updateTraitorTimer(inner, tile);
      wrapper.classList.toggle("urgent", seconds <= 15 && seconds > 0);
      wrapper.classList.toggle("critical", seconds <= 15 && seconds > 0);
    }
  });

  if (arkHull !== undefined) {
    this.updateHull(arkHull, 0);
  }

  this.updateBackground(traitorCount);
};

HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper  = document.createElement("div");
  var inner    = document.createElement("div");
  var position = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.isTraitor()) {
    classes.push("traitor");
  } else if (tile.betrayAt !== null && tile.value >= Tile.BETRAY_THRESHOLD) {
    classes.push("pending-traitor");
  }

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);
  wrapper.setAttribute("data-x", tile.x);
  wrapper.setAttribute("data-y", tile.y);

  inner.classList.add("tile-inner");

  if (tile.isTraitor()) {
    inner.innerHTML = Tile.renderTraitorInner(tile);
    if (tile.getCountdownSeconds() <= 15) {
      wrapper.classList.add("urgent");
    }
  } else if (tile.betrayAt !== null && tile.value >= Tile.BETRAY_THRESHOLD) {
    var turnsLeft = tile.getTurnsUntilBetrayal(this.currentMoveCount || 0);
    inner.innerHTML = tile.value + '<span class="betray-countdown">' + turnsLeft + '</span>';
  } else {
    inner.textContent = tile.value;
  }

  if (tile.previousPosition) {
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes);
      wrapper.setAttribute("data-x", tile.x);
      wrapper.setAttribute("data-y", tile.y);
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else if (tile.purified) {
    classes.push("tile-purified");
    this.applyClasses(wrapper, classes);
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  wrapper.appendChild(inner);
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  var difference = score - this.score;
  this.score = score;

  var valueEl = this.scoreContainer.querySelector(".score-value") || this.scoreContainer;
  valueEl.textContent = this.score;

  var existing = this.scoreContainer.querySelector(".score-addition");
  if (existing) existing.parentNode.removeChild(existing);

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;
    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  var valueEl = this.bestContainer.querySelector(".score-value") || this.bestContainer;
  valueEl.textContent = bestScore;
};

HTMLActuator.prototype.updatePurifyLevel = function (level) {
  if (!this.purifyContainer) return;
  var valueEl = this.purifyContainer.querySelector(".score-value") || this.purifyContainer;
  valueEl.textContent = level || "—";
};

HTMLActuator.prototype.updateBackground = function (traitorCount) {
  var intensity = Math.min(traitorCount / 6, 1);
  document.documentElement.style.setProperty("--danger-level", intensity);
};

HTMLActuator.prototype.updateHull = function (hull, damage) {
  if (!this.hullBar) return;

  var value = Math.max(0, Math.min(100, hull || 0));
  this.hullBar.style.width = value + "%";
  this.hullBar.classList.toggle("hull-low", value <= 30);
  this.hullBar.classList.toggle("hull-critical", value <= 15);

  if (this.hullValue) {
    this.hullValue.textContent = value;
  }

  if (damage > 0) {
    this.showToast("Hull -" + damage, "hull-damage");
  }
};

HTMLActuator.prototype.showCombo = function (combo, perfect) {
  if (!this.comboLayer) return;

  var el = document.createElement("div");
  el.className = "combo-popup" + (perfect ? " perfect" : "");
  el.textContent = perfect && combo <= 1 ?
    "Perfect defuse!" :
    "Combo x" + combo + (perfect ? " · Perfect!" : "");

  this.comboLayer.appendChild(el);

  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1200);
};

HTMLActuator.prototype.showToast = function (text, type) {
  if (!this.gameContainer) return;

  var el = document.createElement("div");
  el.className = "game-toast " + (type || "");
  el.textContent = text;
  this.gameContainer.appendChild(el);

  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 900);
};

HTMLActuator.prototype.showGameOver = function (metadata) {
  var title = metadata.title || "Survivor";
  var maxPurify = metadata.maxPurifyLevel || 0;
  var shareText = this.buildShareText(maxPurify, title, metadata.score);
  var rewards = metadata.gameRewards;

  this.messageContainer.classList.add("game-over");
  this.messageContainer.querySelector(".game-over-title").textContent = "Ark lost";

  var starsEl = this.messageContainer.querySelector(".result-stars");
  if (starsEl && rewards) {
    starsEl.innerHTML = "";
    for (var i = 0; i < 3; i++) {
      var star = document.createElement("span");
      star.className = "result-star" + (rewards.stars[i] ? " earned" : "");
      star.textContent = rewards.stars[i] ? "★" : "☆";
      starsEl.appendChild(star);
    }
  }

  var xpEl = this.messageContainer.querySelector(".game-over-xp");
  if (xpEl && rewards) {
    xpEl.textContent = "Earned " + rewards.xpGained + " XP this run" +
      (rewards.starCount > 0 ? " · " + rewards.starCount + " star(s)" : " · No stars");
  }

  this.messageContainer.querySelector(".game-over-score").textContent =
    "Final score: " + metadata.score;
  this.messageContainer.querySelector(".game-over-purify").textContent =
    "Top defuse level: " + (maxPurify || "none");
  this.messageContainer.querySelector(".game-over-rank").textContent =
    "Captain · " + (metadata.playerProgress ? metadata.playerProgress.title : title);
  this.messageContainer.querySelector(".share-text").textContent = shareText;

  if (this.nextChapterBtn) {
    var canNext = rewards && rewards.unlockedNext &&
      rewards.nextChapter <= this.rewardSystem.getProfile().maxChapterReached;
    this.nextChapterBtn.style.display = canNext ? "inline-block" : "none";
  }

  if (rewards && rewards.achievements.length) {
    var self = this;
    rewards.achievements.forEach(function (item, index) {
      setTimeout(function () {
        self.showRewardModal({
          icon: item.achievement.icon,
          title: "Achievement unlocked!",
          desc: item.achievement.name + " · " + item.achievement.desc,
          xp: "+" + item.xp + " XP"
        });
      }, 800 + index * 1200);
    });
  }

  if (rewards && rewards.levelEvents.length) {
    var self = this;
    rewards.levelEvents.forEach(function (evt, index) {
      setTimeout(function () {
        self.showRewardModal({
          icon: "⬆️",
          title: "Rank up!",
          desc: "Lv." + evt.level + " · " + evt.title,
          xp: ""
        });
      }, 400 + index * 1000);
    });
  }

  this.renderShareCard(metadata);
  this.storageManager.addLeaderboardEntry("Anonymous Captain", metadata.score, maxPurify);
  this.renderLeaderboard();
  this.renderChapterMap();
  this.renderAchievements();
  this.updatePlayerProgress(this.rewardSystem.getLevelProgress());
};

HTMLActuator.prototype.buildShareText = function (maxPurify, title, score) {
  if (maxPurify >= 128) {
    return "I defused a " + maxPurify + " bomb on Out of Control Ark at 2048Hub, earned the title \"" + title + "\", but the ark still fell. Can you last longer?";
  }

  if (maxPurify >= 64) {
    return "I defused a " + maxPurify + " traitor bomb and scored " + score + " on Out of Control Ark — but the ark sank anyway. Beat my run?";
  }

  return "I scored " + score + " on Out of Control Ark before the traitors took over. Think you can build a better ark?";
};

HTMLActuator.prototype.renderShareCard = function (metadata) {
  if (!this.shareCanvas) return;

  var ctx = this.shareCanvas.getContext("2d");
  var w = this.shareCanvas.width;
  var h = this.shareCanvas.height;
  var title = metadata.title || "Survivor";
  var maxPurify = metadata.maxPurifyLevel || 0;

  var grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#0a1628");
  grad.addColorStop(1, "#3d0a0a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,80,60,0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.fillStyle = "#ff6b4a";
  ctx.font = "bold 28px Orbitron, sans-serif";
  ctx.fillText("Out of Control Ark", 30, 55);

  ctx.fillStyle = "#c8d6e5";
  ctx.font="16px Rajdhani, sans-serif";
  ctx.fillText("Ark lost · Final score " + metadata.score, 30, 90);

  ctx.fillStyle = "#ff4757";
  ctx.font = "bold 22px Orbitron, sans-serif";
  if (maxPurify > 0) {
    ctx.fillText("Top defuse " + maxPurify, 30, 130);
    ctx.fillStyle = "#ffa502";
    ctx.font = "18px Rajdhani, sans-serif";
    ctx.fillText("Title · " + title, 30, 160);
  } else {
    ctx.fillText("No defuses completed", 30, 130);
  }

  ctx.fillStyle = "rgba(200,214,229,0.6)";
  ctx.font = "13px Rajdhani, sans-serif";
  var text = this.buildShareText(maxPurify, title, metadata.score);
  this.wrapText(ctx, text, 30, 195, w - 60, 20);

  ctx.fillStyle = "rgba(255,107,74,0.5)";
  ctx.font = "12px Orbitron, sans-serif";
  ctx.fillText("2048hub.com/out-of-control-ark", 30, h - 25);
};

HTMLActuator.prototype.wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
  var chars = text.split("");
  var line = "";

  for (var i = 0; i < chars.length; i++) {
    var testLine = line + chars[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = chars[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
};

HTMLActuator.prototype.renderLeaderboard = function () {
  if (!this.leaderboardList) return;

  var board = this.storageManager.getLeaderboard();
  this.leaderboardList.innerHTML = "";

  if (!board.entries.length) {
    var empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "No entries yet — be the first captain!";
    this.leaderboardList.appendChild(empty);
    return;
  }

  board.entries.forEach(function (entry, index) {
    var li = document.createElement("li");
    var entryTitle = LocalStorageManager.prototype.getTitleForLevel(entry.maxPurify) || "Survivor";
    li.innerHTML =
      "<span class=\"rank\">#" + (index + 1) + "</span>" +
      "<span class=\"name\">" + entry.name + "</span>" +
      "<span class=\"purify\">Defuse " + (entry.maxPurify || "—") + "</span>" +
      "<span class=\"score\">" + entry.score + " pts</span>" +
      (entry.maxPurify >= 128 ? "<span class=\"badge\">" + entryTitle + "</span>" : "");
    this.leaderboardList.appendChild(li);
  }, this);
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.message = function () {};

HTMLActuator.prototype.initLeaderboard = function () {
  if (!this.rewardSystem) return;

  this.renderLeaderboard();
  this.renderChapterMap();
  this.renderAchievements();
  this.updatePlayerProgress(this.rewardSystem.getLevelProgress());
  this.updateMissionPanel(
    this.rewardSystem.getChapter(),
    this.rewardSystem.getMissionProgress(
      this.rewardSystem.getProfile().currentChapter,
      { purifyCount: 0 }
    )
  );

  if (!this.rewardSystem.getProfile().dailyClaimed) {
    var daily = this.rewardSystem.claimDailyReward();
    if (daily) {
      var self = this;
      setTimeout(function () {
        self.showRewardModal({
          icon: "📦",
          title: "Daily supply!",
          desc: daily.streak + "-day login streak",
          xp: "+" + daily.amount + " XP"
        });
        self.updatePlayerProgress(self.rewardSystem.getLevelProgress());
      }, 500);
    }
  }
};

HTMLActuator.prototype.updatePlayerProgress = function (progress) {
  if (!progress) return;

  if (this.playerLevelEl) this.playerLevelEl.textContent = "Lv." + progress.level;
  if (this.playerTitleEl) this.playerTitleEl.textContent = progress.title;
  if (this.xpBarFill) this.xpBarFill.style.width = progress.percent + "%";
  if (this.xpCurrentEl) this.xpCurrentEl.textContent = progress.progress;
  if (this.xpNeedEl) this.xpNeedEl.textContent = progress.need;
};

HTMLActuator.prototype.updateMissionPanel = function (chapter, mission) {
  if (!chapter || !mission) return;

  if (this.chapterTitleEl) {
    this.chapterTitleEl.textContent = "Chapter " + chapter.id + " · " + chapter.name;
  }

  if (this.chapterStarsEl) {
    var best = this.rewardSystem.getProfile().chapterStars[String(chapter.id)] || 0;
    this.chapterStarsEl.innerHTML =
      '<span class="star-slot' + (best >= 1 ? " earned" : "") + '">' + (best >= 1 ? "★" : "☆") + "</span>" +
      '<span class="star-slot' + (best >= 2 ? " earned" : "") + '">' + (best >= 2 ? "★" : "☆") + "</span>" +
      '<span class="star-slot' + (best >= 3 ? " earned" : "") + '">' + (best >= 3 ? "★" : "☆") + "</span>";
  }

  if (this.missionTextEl) {
    this.missionTextEl.textContent = "Mission: " + mission.label;
  }

  if (this.missionBarFill) {
    this.missionBarFill.style.width = mission.percent + "%";
  }

  if (this.missionCountEl) {
    this.missionCountEl.textContent = mission.current + " / " + mission.target;
  }
};

HTMLActuator.prototype.repeatStars = function (earned) {
  var s = "";
  var i;
  for (i = 0; i < earned; i++) s += "★";
  for (i = earned; i < 3; i++) s += "☆";
  return s;
};

HTMLActuator.prototype.renderChapterMap = function () {
  if (!this.chapterMapEl || !this.rewardSystem) return;

  var profile = this.rewardSystem.getProfile();
  var max = Math.max(profile.maxChapterReached, 1);
  var html = "";

  for (var i = 1; i <= Math.min(max + 1, 12); i++) {
    var locked = i > profile.maxChapterReached;
    var active = i === profile.currentChapter;
    var stars = profile.chapterStars[String(i)] || 0;
    html += '<button type="button" class="chapter-node' +
      (locked ? " locked" : "") +
      (active ? " active" : "") +
      '" data-chapter="' + i + '"' +
      (locked ? " disabled" : "") + ">" +
      "<span class=\"node-num\">" + i + "</span>" +
      "<span class=\"node-stars\">" + this.repeatStars(stars) + "</span>" +
      "</button>";
  }

  this.chapterMapEl.innerHTML = html;
};

HTMLActuator.prototype.renderAchievements = function () {
  if (!this.achievementGrid || !this.rewardSystem) return;

  var unlocked = this.rewardSystem.getProfile().achievements;
  var html = "";

  RewardSystem.getAchievementList().forEach(function (ach) {
    var done = unlocked.indexOf(ach.id) !== -1;
    html += '<div class="achievement-card' + (done ? " unlocked" : "") + '">' +
      '<span class="ach-icon">' + ach.icon + "</span>" +
      "<strong>" + ach.name + "</strong>" +
      "<p>" + ach.desc + "</p>" +
      '<span class="ach-xp">+' + ach.xp + " XP</span>" +
      "</div>";
  });

  this.achievementGrid.innerHTML = html;
};

HTMLActuator.prototype.showXPFloater = function (text) {
  if (!this.gameContainer) return;

  var el = document.createElement("div");
  el.className = "xp-floater";
  el.textContent = text;
  this.gameContainer.appendChild(el);

  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1100);
};

HTMLActuator.prototype.queueReward = function (data) {
  this.pendingRewards.push(data);
};

HTMLActuator.prototype.flushRewardQueue = function () {
  if (!this.pendingRewards.length) return;
  if (!this.rewardOverlay || !this.rewardOverlay.classList.contains("hidden")) return;

  var reward = this.pendingRewards.shift();
  this.showRewardModal(reward);
};

HTMLActuator.prototype.showRewardModal = function (data) {
  if (!this.rewardOverlay) return;

  this.rewardOverlay.querySelector(".reward-icon").textContent = data.icon || "🎁";
  this.rewardTitleEl.textContent = data.title || "";
  this.rewardDescEl.textContent = data.desc || "";
  this.rewardXpEl.textContent = data.xp || "";
  this.rewardOverlay.classList.remove("hidden");
};

HTMLActuator.prototype.hideRewardModal = function () {
  if (this.rewardOverlay) {
    this.rewardOverlay.classList.add("hidden");
  }
};
