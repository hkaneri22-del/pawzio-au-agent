function getTikTokSignal(title) {

  const text = String(title || "").toLowerCase();

  const viralKeywords = [
    "pet hair remover",
    "dog grooming",
    "cat brush",
    "pet cleaner",
    "dog toy",
    "interactive toy",
    "lick mat",
    "pet water fountain",
    "portable pet bottle",
    "self cleaning brush"
  ];

  let score = 0;

  for (const keyword of viralKeywords) {
    if (text.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

module.exports = { getTikTokSignal };