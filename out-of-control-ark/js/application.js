window.requestAnimationFrame(function () {
  var game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  game.actuator.initLeaderboard();

  document.querySelectorAll(".restart-button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      game.restart();
    });
  });

  var nextBtn = document.querySelector(".next-chapter-button");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      game.nextChapter();
      game.actuator.continueGame();
    });
  }

  var chapterMap = document.querySelector(".chapter-map");
  if (chapterMap) {
    chapterMap.addEventListener("click", function (event) {
      var node = event.target.closest(".chapter-node");
      if (!node || node.classList.contains("locked")) return;
      game.selectChapter(parseInt(node.getAttribute("data-chapter"), 10));
    });
  }

  var rewardConfirm = document.querySelector(".reward-confirm");
  if (rewardConfirm) {
    rewardConfirm.addEventListener("click", function () {
      game.actuator.hideRewardModal();
      game.actuator.updatePlayerProgress(game.rewardSystem.getLevelProgress());
      setTimeout(function () {
        game.actuator.flushRewardQueue();
      }, 300);
    });
  }

  document.querySelector(".share-button").addEventListener("click", function () {
    var canvas = document.querySelector("#share-canvas");
    if (!canvas) return;

    canvas.toBlob(function (blob) {
      if (navigator.share && blob) {
        var file = new File([blob], "ark-score.png", { type: "image/png" });
        navigator.share({
          title: "Out of Control Ark",
          text: document.querySelector(".share-text").textContent,
          files: [file]
        }).catch(function () {});
      } else {
        var link = document.createElement("a");
        link.download = "ark-score.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    });
  });

  document.querySelector(".copy-button").addEventListener("click", function () {
    var text = document.querySelector(".share-text").textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  });
});
