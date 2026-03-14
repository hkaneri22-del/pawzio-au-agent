function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean);
}

function scoreMatch(shopifyTitle, cjTitle) {
  const shopifyWords = normalize(shopifyTitle);
  const cjWords = normalize(cjTitle);

  let matches = 0;

  shopifyWords.forEach(word => {
    if (cjWords.includes(word)) {
      matches++;
    }
  });

  const score = matches / shopifyWords.length;

  return score;
}

function isGoodCJMatch(shopifyTitle, cjTitle) {
 const strongKeywords = [
  "sofa",
  "seat",
  "bed",
  "fountain",
  "collar",
  "feeder",
  "litter",
  "scratcher",
  "toy"
];
  const importantMatch = strongKeywords.some(word =>
  shopifyTitle.toLowerCase().includes(word) &&
  cjTitle.toLowerCase().includes(word)
);

if (importantMatch) {
  return {
    score: 1,
    good: true
  };
}
  const score = scoreMatch(shopifyTitle, cjTitle);

  return {
    score,
    good: score >= 0.25
  };
}

module.exports = {
  isGoodCJMatch
};