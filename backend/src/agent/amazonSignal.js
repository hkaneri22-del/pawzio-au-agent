async function getAmazonSignal(title) {

  const text = String(title || "").toLowerCase();

  const strong = [
    "pet hair remover",
    "dog brush",
    "cat brush",
    "pet grooming",
    "dog toy",
    "pet feeder",
    "water fountain",
    "lick mat",
    "pet travel",
    "pet cleaner"
  ];

  let score = 0;

  for (const keyword of strong) {
    if (text.includes(keyword)) {
      score += 1;
    }
  }

  return score;
}

module.exports = { getAmazonSignal };