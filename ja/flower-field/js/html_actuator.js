function HTMLActuator() {
  this.tileContainer      = document.querySelector(".tile-container");
  this.scoreContainer     = document.querySelector(".score-container");
  this.bestContainer      = document.querySelector(".best-container");
  this.messageContainer   = document.querySelector(".game-message");
  this.wishDropBtn        = document.querySelector(".wish-drop-btn");
  this.wishDropCount      = document.querySelector(".wish-drop-count");
  this.gameContainer      = document.querySelector(".game-container");
  this.flowerModal        = document.querySelector(".flower-modal");
  this.flowerModalEmoji   = document.querySelector(".flower-modal-emoji");
  this.flowerModalTitle   = document.querySelector(".flower-modal-title");
  this.flowerModalText    = document.querySelector(".flower-modal-text");
  this.flowerModalKeep    = document.querySelector(".flower-modal-keep");
  this.gardenBg           = document.querySelector(".garden-bg");
  this.notebookList       = document.querySelector(".notebook-list");
  this.notebookEmpty      = document.querySelector(".notebook-empty");
  this.gardenPanelBtn     = document.querySelector(".garden-panel-btn");
  this.gardenPanel        = document.querySelector(".garden-panel");
  this.gardenPanelClose   = document.querySelector(".garden-panel-close");
  this.shareBtn           = document.querySelector(".share-btn");
  this.shareCanvas        = document.querySelector(".share-canvas");

  this.score = 0;
  this.shareUrl = "https://2048hub.com/ja/flower-field/";

  var self = this;

  if (this.wishDropBtn) {
    this.wishDropBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (self.onWishDropToggle) self.onWishDropToggle();
    });
  }

  if (this.flowerModalKeep) {
    this.flowerModalKeep.addEventListener("click", function (e) {
      e.preventDefault();
      self.hideFlowerMessage();
      if (self.onMilestoneDismiss) self.onMilestoneDismiss();
    });
  }

  if (this.gardenPanelBtn) {
    this.gardenPanelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      self.gardenPanel.classList.add("is-open");
    });
  }

  if (this.gardenPanelClose) {
    this.gardenPanelClose.addEventListener("click", function (e) {
      e.preventDefault();
      self.gardenPanel.classList.remove("is-open");
    });
  }

  if (this.shareBtn) {
    this.shareBtn.addEventListener("click", function (e) {
      e.preventDefault();
      self.shareResult();
    });
  }
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) self.addTile(cell);
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
    self.setWishDropMode(metadata.wishDropMode);

    if (metadata.terminated) {
      self.message(metadata);
    }
  });
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
  var stage = FlowerConfig.getStage(tile.value);
  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);
  var classes = ["tile", "tile-" + tile.value, "stage-" + stage.label, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);
  wrapper.dataset.x = tile.x;
  wrapper.dataset.y = tile.y;

  inner.classList.add("tile-inner");
  inner.innerHTML = "<span class=\"tile-emoji\">" + stage.emoji + "</span>";

  wrapper.addEventListener("click", function () {
    if (self.onTileClick) {
      self.onTileClick(parseInt(wrapper.dataset.x, 10), parseInt(wrapper.dataset.y, 10));
    }
  });

  if (tile.previousPosition) {
    window.requestAnimationFrame(function () {
      classes[3] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes);
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
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
  this.clearContainer(this.scoreContainer);
  var difference = score - this.score;
  this.score = score;
  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;
    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateWishDrops = function (count) {
  if (this.wishDropCount) this.wishDropCount.textContent = count;
  if (this.wishDropBtn) {
    this.wishDropBtn.disabled = count <= 0;
    this.wishDropBtn.classList.toggle("is-empty", count <= 0);
  }
};

HTMLActuator.prototype.setWishDropMode = function (active) {
  if (this.gameContainer) {
    this.gameContainer.classList.toggle("wish-drop-active", !!active);
  }
  if (this.wishDropBtn) {
    this.wishDropBtn.classList.toggle("is-active", !!active);
  }
};

HTMLActuator.prototype.showFlowerMessage = function (data) {
  if (!this.flowerModal) return;
  this.flowerModalEmoji.textContent = data.stage.emoji;
  this.flowerModalTitle.textContent = data.stage.name;
  this.flowerModalText.textContent = data.message;
  this.flowerModal.classList.add("is-visible");
};

HTMLActuator.prototype.hideFlowerMessage = function () {
  if (this.flowerModal) this.flowerModal.classList.remove("is-visible");
};

HTMLActuator.prototype.renderGarden = function (gardenValues) {
  if (!this.gardenBg) return;
  this.gardenBg.innerHTML = "";
  gardenValues.forEach(function (value) {
    var stage = FlowerConfig.getStage(value);
    var el = document.createElement("span");
    el.className = "garden-flower garden-" + stage.label;
    el.textContent = stage.emoji;
    el.title = stage.name;
    this.gardenBg.appendChild(el);
  }.bind(this));
};

HTMLActuator.prototype.renderNotebook = function (entries) {
  var lists = document.querySelectorAll(".notebook-list");
  var empties = document.querySelectorAll(".notebook-empty");
  if (!lists.length) return;

  lists.forEach(function (list) {
    while (list.firstChild) list.removeChild(list.firstChild);
    entries.forEach(function (entry) {
      var stage = FlowerConfig.getStage(entry.value);
      var item = document.createElement("li");
      item.className = "notebook-item";
      item.innerHTML =
        "<span class=\"notebook-emoji\">" + stage.emoji + "</span>" +
        "<div class=\"notebook-body\">" +
          "<strong class=\"notebook-name\">" + entry.name + "</strong>" +
          "<p class=\"notebook-msg\">" + entry.message + "</p>" +
        "</div>";
      list.appendChild(item);
    });
  });

  empties.forEach(function (el) {
    el.style.display = entries.length ? "none" : "block";
  });
};

HTMLActuator.prototype.message = function (metadata) {
  var type = metadata.won ? "game-won" : "game-over";
  this.messageContainer.classList.add(type);

  var names = (metadata.sessionMilestones || []).map(function (m) { return m.name; });
  var bloomLine = names.length
    ? "今回咲いた花：" + names.join("、")
    : "まだ花は咲いていません。でも、タネの一つ一つが大切です。";

  var highest = metadata.highestBloom
    ? FlowerConfig.getStage(metadata.highestBloom).name
    : "タネ";

  var notebookLine;
  if (metadata.sessionNewNotebook) {
    notebookLine = "ノートに新しい言葉が " + metadata.sessionNewNotebook + " 件加わりました。";
  } else {
    notebookLine = "ノートは、次のささやきを待っています。";
  }

  var highestMsg = metadata.highestBloom >= 32
    ? FlowerConfig.getMessage(metadata.highestBloom)
    : "この庭を、まだ育て続けられます。";

  this.lastShareData = {
    highest: highest,
    message: highestMsg,
    blooms: names
  };

  var p = this.messageContainer.querySelector(".summary-text");
  if (p) {
    p.innerHTML =
      bloomLine + "<br><br>" +
      "<strong>最高の花：</strong>" + highest + "<br>" +
      notebookLine;
  }

  this.drawShareCard(this.lastShareData);
};

HTMLActuator.prototype.drawShareCard = function (data) {
  if (!this.shareCanvas) return;
  var ctx = this.shareCanvas.getContext("2d");
  var w = this.shareCanvas.width;
  var h = this.shareCanvas.height;
  var fontJa = "\"Hiragino Sans\", \"Yu Gothic UI\", \"Meiryo\", sans-serif";

  var grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#faf6ee");
  grad.addColorStop(1, "#e8f0dc");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#5a6b4a";
  ctx.font = "600 22px " + fontJa;
  ctx.fillText("2048 花野", 24, 40);

  ctx.fillStyle = "#7a8f6a";
  ctx.font = "16px " + fontJa;
  ctx.fillText("2048Hubで、小さな花畑を育てました。", 24, 72);

  ctx.fillStyle = "#4a5a3a";
  ctx.font = "bold 20px " + fontJa;
  ctx.fillText("最高の花：" + data.highest, 24, 110);

  ctx.fillStyle = "#6a7a5a";
  ctx.font = "15px " + fontJa;
  wrapTextJa(ctx, "「" + data.message + "」", 24, 145, w - 48, 22);

  ctx.fillStyle = "#9aab8a";
  ctx.font = "13px " + fontJa;
  ctx.fillText("2048hub.com/ja/flower-field", 24, h - 24);
};

function wrapTextJa(ctx, text, x, y, maxWidth, lineHeight) {
  var line = "";
  for (var i = 0; i < text.length; i++) {
    var testLine = line + text.charAt(i);
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, y);
      line = text.charAt(i);
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

HTMLActuator.prototype.shareResult = function () {
  var data = this.lastShareData || {
    highest: "タネ",
    message: "この庭を、まだ育て続けられます。",
    blooms: []
  };
  var text =
    "2048Hubの「花野」で花畑を育てました。最高の花は「" + data.highest +
    "」。花はこう言いました — 「" + data.message +
    "」。あなたも、どんな花が咲くか試してみませんか？\n" + this.shareUrl;

  if (navigator.share) {
    navigator.share({ title: "2048 花野", text: text, url: this.shareUrl }).catch(function () {});
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      alert("シェア文をコピーしました。");
    });
    return;
  }

  prompt("コピーしてシェアしよう：", text);
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
