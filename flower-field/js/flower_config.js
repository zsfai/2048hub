var FlowerConfig = (function () {
  var STAGES = {
    2:    { emoji: "🌱", name: "Seed", label: "seed" },
    4:    { emoji: "🌿", name: "Sprout", label: "sprout" },
    8:    { emoji: "🌷", name: "Bud", label: "bud" },
    16:   { emoji: "🌸", name: "Opening", label: "opening" },
    32:   { emoji: "🌼", name: "First Bloom", label: "first-bloom" },
    64:   { emoji: "🌻", name: "Flower Cluster", label: "cluster" },
    128:  { emoji: "✨", name: "Lumen Bloom", label: "lumen" },
    256:  { emoji: "🌟", name: "Golden Rain", label: "golden" },
    512:  { emoji: "🌈", name: "Prism Bloom", label: "prism" },
    1024: { emoji: "🦋", name: "Night Bloom", label: "night" },
    2048: { emoji: "☀️", name: "Wishing Bloom", label: "wishing" }
  };

  var MILESTONES = [32, 64, 128, 256, 512, 1024, 2048];

  var MESSAGES = {
    32: "Look — keep going, and the flower opens.",
    64: "You're not wasting time. You're watering yourself.",
    128: "Some growth only you can see.",
    256: "You deserve every beautiful thing.",
    512: "Today you're a little braver than yesterday.",
    1024: "Even in the deepest night, light keeps growing.",
    2048: "Make a wish. You who live with care deserve to be rewarded."
  };

  function getStage(value) {
    return STAGES[value] || { emoji: "🌸", name: "Bloom", label: "super" };
  }

  function isMilestone(value) {
    return MILESTONES.indexOf(value) !== -1;
  }

  function getMessage(value) {
    return MESSAGES[value] || "";
  }

  function getMilestones() {
    return MILESTONES.slice();
  }

  return {
    getStage: getStage,
    isMilestone: isMilestone,
    getMessage: getMessage,
    getMilestones: getMilestones,
    STAGES: STAGES
  };
})();
