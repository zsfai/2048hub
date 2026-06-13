var FlowerConfig = (function () {
  var STAGES = {
    2:    { emoji: "🌱", name: "タネ", label: "seed" },
    4:    { emoji: "🌿", name: "芽", label: "sprout" },
    8:    { emoji: "🌷", name: "つぼみ", label: "bud" },
    16:   { emoji: "🌸", name: "開きかけ", label: "opening" },
    32:   { emoji: "🌼", name: "最初の花", label: "first-bloom" },
    64:   { emoji: "🌻", name: "花の群れ", label: "cluster" },
    128:  { emoji: "✨", name: "ひかりの花", label: "lumen" },
    256:  { emoji: "🌟", name: "金の雨", label: "golden" },
    512:  { emoji: "🌈", name: "虹の花", label: "prism" },
    1024: { emoji: "🦋", name: "よるの花", label: "night" },
    2048: { emoji: "☀️", name: "願いの花", label: "wishing" }
  };

  var MILESTONES = [32, 64, 128, 256, 512, 1024, 2048];

  var MESSAGES = {
    32: "ほら、もう少し続ければ、花が咲くよ。",
    64: "時間を無駄にしているんじゃない。自分を育てているんだよ。",
    128: "誰にも見えない成長も、きっとある。",
    256: "あなたは、すべての美しいものを受け取っていい。",
    512: "今日のあなたは、昨日より少しだけ勇敢。",
    1024: "どんなに深い夜でも、光は育ち続ける。",
    2048: "願い事をしよう。丁寧に生きるあなたは、報われるべき人。"
  };

  function getStage(value) {
    return STAGES[value] || { emoji: "🌸", name: "花", label: "super" };
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
