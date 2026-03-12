function getMetaSignal(title) {
  const text = String(title || "").toLowerCase();

  const winnerKeywords = [
    "pet hair remover",
    "dog brush",
    "cat brush",
    "self cleaning brush",
    "lick mat",
    "water fountain",
    "dog collar",
    "led dog collar",
    "portable pet bottle",
    "pet cleaner",
    "interactive toy",
    "pet grooming",
    "pet feeder",
    "travel bowl",
    "seat protector"
  ];

  let score = 0;

  for (const keyword of winnerKeywords) {
    if (text.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

module.exports = { getMetaSignal };