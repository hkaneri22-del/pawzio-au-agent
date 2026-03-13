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
  const score = scoreMatch(shopifyTitle, cjTitle);

  return {
    score,
    good: score >= 0.4
  };
}

module.exports = {
  isGoodCJMatch
};