function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);
}

function scoreMatch(shopifyTitle, cjTitle) {
  const shopifyWords = normalize(shopifyTitle);
  const cjWords = normalize(cjTitle);

  if (!shopifyWords.length) return 0;

  let matches = 0;

  shopifyWords.forEach((word) => {
    if (cjWords.includes(word)) {
      matches++;
    }
  });

  return matches / shopifyWords.length;
}

function countImportantMatches(shopifyTitle, cjTitle) {
  const shopifyLower = String(shopifyTitle || "").toLowerCase();
  const cjLower = String(cjTitle || "").toLowerCase();

  const strongKeywords = [
    "pet",
    "dog",
    "cat",
    "collar",
    "brush",
    "remover",
    "fountain",
    "feeder",
    "toy",
    "bed",
    "bowl",
    "carrier",
    "cleaner",
    "grooming",
    "hair",
    "leash",
    "harness",
    "tunnel"
  ];

  let count = 0;

  strongKeywords.forEach((word) => {
    if (shopifyLower.includes(word) && cjLower.includes(word)) {
      count++;
    }
  });

  return count;
}

function isGoodCJMatch(shopifyTitle, cjTitle) {
  const score = scoreMatch(shopifyTitle, cjTitle);
  const importantMatchCount = countImportantMatches(shopifyTitle, cjTitle);

  // strict logic
  const good =
    (importantMatchCount >= 2 && score >= 0.4) ||
    score >= 0.6;

  return {
    score,
    importantMatchCount,
    good
  };
}

module.exports = {
  isGoodCJMatch
};
