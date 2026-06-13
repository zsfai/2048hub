var RewardSystem = (function () {
  var CHAPTER_NAMES = [
    "Shelter Bay", "Engine Room", "Living Quarters", "Med Bay", "Command Bridge",
    "Armory", "Research Lab", "Power Core", "Cryo Bay", "Observatory",
    "Deep Space Port", "Furnace Deck", "Eco Dome", "Comm Array", "Final Ark"
  ];

  var ACHIEVEMENTS = [
    { id: "first_purify", icon: "💥", name: "First Defuse", desc: "Complete your first defuse", check: function (s) { return s.purifyCount >= 1; }, xp: 80 },
    { id: "combo_master", icon: "🔥", name: "Combo Master", desc: "Hit a 3x defuse combo in one run", check: function (s) { return s.maxCombo >= 3; }, xp: 150 },
    { id: "perfect_3", icon: "✨", name: "Steady Hands", desc: "3 perfect defuses in one run", check: function (s) { return s.perfectCount >= 3; }, xp: 200 },
    { id: "survivor", icon: "🛡️", name: "Ark Survivor", desc: "Sink with hull still at 50+", check: function (s) { return s.over && s.arkHull >= 50; }, xp: 120 },
    { id: "purify_64", icon: "🎯", name: "Rookie Defuser", desc: "Defuse a 64 bomb", check: function (s) { return s.maxPurifyLevel >= 64; }, xp: 120 },
    { id: "purify_128", icon: "🎯", name: "Bomb Expert", desc: "Defuse a 128 bomb", check: function (s) { return s.maxPurifyLevel >= 128; }, xp: 300 },
    { id: "score_3k", icon: "🏆", name: "High Scorer", desc: "Score 3000 in one run", check: function (s) { return s.score >= 3000; }, xp: 250 },
    { id: "chapter_5", icon: "🚀", name: "Deep Space Pioneer", desc: "Clear chapter 5", check: function (s, p) { return p.maxChapterReached >= 5; }, xp: 400 },
    { id: "streak_3", icon: "📅", name: "Three-Day Watch", desc: "Log in 3 days in a row", check: function (s, p) { return p.loginStreak >= 3; }, xp: 200 },
    { id: "level_10", icon: "⭐", name: "Captain X", desc: "Reach captain level 10", check: function (s, p) { return p.level >= 10; }, xp: 500 },
    { id: "purify_10", icon: "💣", name: "Bomb Buster", desc: "Defuse 10 bombs lifetime", check: function (s, p) { return p.lifetimePurifies >= 10; }, xp: 180 }
  ];

  function xpForLevel(level) {
    return Math.floor(100 + (level - 1) * 65 + Math.pow(level - 1, 1.35) * 12);
  }

  function getRankTitle(level) {
    if (level >= 30) return "Deity";
    if (level >= 20) return "Ark Captain";
    if (level >= 15) return "Apocalypse Engineer";
    if (level >= 10) return "Bomb Expert";
    if (level >= 7) return "Ark Guard";
    if (level >= 4) return "Demolition Apprentice";
    if (level >= 2) return "Cadet";
    return "Recruit";
  }

  function getChapterDef(chapterId) {
    var idx = chapterId - 1;
    var name = CHAPTER_NAMES[idx] || ("Sector " + chapterId);
    var scale = 1 + Math.floor(idx / 8) * 0.2;
    var missionTarget = Math.max(1, Math.ceil(1 + idx * 0.35));

    return {
      id: chapterId,
      name: name,
      mission: {
        type: "purify",
        target: missionTarget,
        label: "Defuse " + missionTarget + " bomb" + (missionTarget > 1 ? "s" : "")
      },
      stars: [
        {
          type: "purify",
          value: 1,
          label: "Defuse 1 bomb"
        },
        {
          type: "score",
          value: Math.floor((300 + idx * 200) * scale),
          label: "Score " + Math.floor((300 + idx * 200) * scale)
        },
        {
          type: "hull",
          value: Math.max(20, 40 - Math.floor(idx / 3) * 3),
          label: "Hull >= " + Math.max(20, 40 - Math.floor(idx / 3) * 3)
        }
      ],
      clearXP: Math.floor(80 + idx * 30)
    };
  }

  function defaultProfile() {
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

  function RewardSystem(storageManager) {
    this.storage = storageManager;
    this.profile = this.storage.getPlayerProfile();
    this.processDailyLogin();
  }

  RewardSystem.prototype.processDailyLogin = function () {
    var today = this.storage.getTodayKey();
    var profile = this.profile;

    if (profile.lastLoginDate === today) {
      return null;
    }

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayKey = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();

    if (profile.lastLoginDate === yesterdayKey) {
      profile.loginStreak += 1;
    } else {
      profile.loginStreak = 1;
    }

    profile.lastLoginDate = today;
    profile.dailyClaimed = false;
    this.saveProfile();
    return profile.loginStreak;
  };

  RewardSystem.prototype.saveProfile = function () {
    this.storage.setPlayerProfile(this.profile);
  };

  RewardSystem.prototype.getProfile = function () {
    return this.profile;
  };

  RewardSystem.prototype.getChapter = function (chapterId) {
    return getChapterDef(chapterId || this.profile.currentChapter);
  };

  RewardSystem.prototype.setChapter = function (chapterId) {
    if (chapterId <= this.profile.maxChapterReached) {
      this.profile.currentChapter = chapterId;
      this.saveProfile();
    }
  };

  RewardSystem.prototype.getLevelProgress = function () {
    var level = this.profile.level;
    var xp = this.profile.xp;
    var currentLevelFloor = 0;

    for (var i = 1; i < level; i++) {
      currentLevelFloor += xpForLevel(i);
    }

    var need = xpForLevel(level);
    var progress = xp - currentLevelFloor;

    return {
      level: level,
      title: getRankTitle(level),
      progress: progress,
      need: need,
      percent: Math.min(100, Math.floor((progress / need) * 100))
    };
  };

  RewardSystem.prototype.addXP = function (amount, profile) {
    profile = profile || this.profile;
    profile.xp += amount;

    var events = [];
    var levelData = this.getLevelProgressFromProfile(profile);

    while (levelData.progress >= levelData.need) {
      profile.level += 1;
      events.push({
        type: "levelUp",
        level: profile.level,
        title: getRankTitle(profile.level)
      });
      levelData = this.getLevelProgressFromProfile(profile);
    }

    this.saveProfile();
    return { amount: amount, events: events };
  };

  RewardSystem.prototype.getLevelProgressFromProfile = function (profile) {
    var level = profile.level;
    var xp = profile.xp;
    var floor = 0;

    for (var i = 1; i < level; i++) {
      floor += xpForLevel(i);
    }

    var need = xpForLevel(level);
    return {
      level: level,
      title: getRankTitle(level),
      progress: xp - floor,
      need: need,
      percent: Math.min(100, Math.floor(((xp - floor) / need) * 100))
    };
  };

  RewardSystem.prototype.evaluateStar = function (star, stats) {
    switch (star.type) {
      case "purify":
        return stats.purifyCount >= star.value;
      case "score":
        return stats.score >= star.value;
      case "hull":
        return stats.arkHull >= star.value;
      case "combo":
        return stats.maxCombo >= star.value;
      case "maxPurify":
        return stats.maxPurifyLevel >= star.value;
      default:
        return false;
    }
  };

  RewardSystem.prototype.evaluateChapterStars = function (chapterId, stats) {
    var chapter = getChapterDef(chapterId);
    var stars = [false, false, false];

    for (var i = 0; i < chapter.stars.length; i++) {
      stars[i] = this.evaluateStar(chapter.stars[i], stats);
    }

    return stars;
  };

  RewardSystem.prototype.getMissionProgress = function (chapterId, stats) {
    var chapter = getChapterDef(chapterId);
    var mission = chapter.mission;
    var current = 0;

    if (mission.type === "purify") current = stats.purifyCount;

    return {
      label: mission.label,
      current: current,
      target: mission.target,
      percent: Math.min(100, Math.floor((current / mission.target) * 100)),
      complete: current >= mission.target
    };
  };

  RewardSystem.prototype.onMerge = function () {
    return this.addXP(3);
  };

  RewardSystem.prototype.onPurify = function (meta, stats) {
    var xp = 30;
    var bonuses = [];

    if (meta.perfectDefuse) {
      xp += 25;
      bonuses.push("Perfect +25");
    }

    if (meta.combo > 1) {
      xp += (meta.combo - 1) * 20;
      bonuses.push("Combo +" + ((meta.combo - 1) * 20));
    }

    this.profile.lifetimePurifies += 1;
    var result = this.addXP(xp);
    result.bonuses = bonuses;
    return result;
  };

  RewardSystem.prototype.checkMissionComplete = function (chapterId, stats, wasComplete) {
    var progress = this.getMissionProgress(chapterId, stats);
    if (progress.complete && !wasComplete) {
      var chapter = getChapterDef(chapterId);
      var result = this.addXP(chapter.clearXP);
      result.type = "missionComplete";
      result.chapter = chapter;
      return result;
    }
    return null;
  };

  RewardSystem.prototype.checkAchievements = function (stats) {
    var unlocked = [];
    var profile = this.profile;

    ACHIEVEMENTS.forEach(function (ach) {
      if (profile.achievements.indexOf(ach.id) !== -1) return;
      if (!ach.check(stats, profile)) return;

      profile.achievements.push(ach.id);
      var xpResult = this.addXP(ach.xp, profile);
      unlocked.push({
        achievement: ach,
        xp: ach.xp,
        levelEvents: xpResult.events
      });
    }, this);

    if (unlocked.length) {
      this.saveProfile();
    }

    return unlocked;
  };

  RewardSystem.prototype.claimDailyReward = function () {
    if (this.profile.dailyClaimed) return null;

    var base = 60;
    var streakBonus = Math.min(this.profile.loginStreak, 7) * 15;
    var total = base + streakBonus;

    this.profile.dailyClaimed = true;
    var result = this.addXP(total);
    result.type = "daily";
    result.streak = this.profile.loginStreak;
    result.amount = total;
    this.saveProfile();
    return result;
  };

  RewardSystem.prototype.onGameOver = function (stats) {
    var profile = this.profile;
    var chapterId = profile.currentChapter;
    var chapter = getChapterDef(chapterId);
    var stars = this.evaluateChapterStars(chapterId, stats);
    var starCount = stars.filter(Boolean).length;
    var prevBest = profile.chapterStars[String(chapterId)] || 0;
    var newBest = Math.max(prevBest, starCount);

    profile.chapterStars[String(chapterId)] = newBest;
    profile.totalGames += 1;
    profile.lifetimeScore += stats.score;

    if (starCount > 0 && chapterId >= profile.maxChapterReached) {
      profile.maxChapterReached = Math.max(profile.maxChapterReached, chapterId + 1);
    }

    var totalXP = starCount * 50;
    if (newBest > prevBest) {
      totalXP += (newBest - prevBest) * 80;
    }
    if (starCount === 3 && prevBest < 3) {
      totalXP += 150;
    }

    var xpResult = this.addXP(totalXP);
    var achievements = this.checkAchievements(Object.assign({}, stats, { over: true }));

    this.saveProfile();

    return {
      chapter: chapter,
      stars: stars,
      starCount: starCount,
      newBest: newBest,
      prevBest: prevBest,
      xpGained: totalXP,
      levelEvents: xpResult.events,
      achievements: achievements,
      unlockedNext: starCount > 0,
      nextChapter: chapterId + 1,
      profile: this.getLevelProgress()
    };
  };

  RewardSystem.prototype.createSessionStats = function () {
    return {
      purifyCount: 0,
      perfectCount: 0,
      maxCombo: 0,
      score: 0,
      arkHull: 100,
      maxPurifyLevel: 0,
      moveCount: 0
    };
  };

  RewardSystem.getAchievementList = function () {
    return ACHIEVEMENTS;
  };

  return RewardSystem;
})();
