const fs = require("fs");
const path = require("path");
const { readMemory } = require("./productMemory");

const KEYWORDS_PATH = path.join(__dirname, "winningKeywords.json");

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "from",
  "your",
  "you",
  "pet",
  "dog",
  "cat",
  "tool",
  "kit",
  "set",
  "new",
  "best",
  "smart"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function extractWinningKeywords() {
  const memory = readMemory();

  const successful = memory.filter(
    (item) => item.status === "shopify_created"
  );

  const frequency = {};

  for (const item of successful) {
    const words = tokenize(item.title);

    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([keyword, count]) => ({ keyword, count }));

  return sorted.slice(0, 30);
}

function saveWinningKeywords() {
  try {
    const keywords = extractWinningKeywords();

    fs.writeFileSync(
      KEYWORDS_PATH,
      JSON.stringify(keywords, null, 2),
      "utf8"
    );

    console.log("🏆 Winning keywords saved:", keywords.length);
    return keywords;
  } catch (err) {
    console.log("❌ Failed to save winning keywords");
    console.log(err.message);
    return [];
  }
}

function readWinningKeywords() {
  try {
    if (!fs.existsSync(KEYWORDS_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(KEYWORDS_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.log("❌ Failed to read winning keywords");
    console.log(err.message);
    return [];
  }
}

function getWinningKeywordBoost(title) {
  const keywords = readWinningKeywords();
  const words = tokenize(title);

  let boost = 0;
  let matchedKeywords = [];

  for (const entry of keywords) {
    if (words.includes(entry.keyword)) {
      boost += Math.min(entry.count * 0.5, 2);
      matchedKeywords.push(entry.keyword);
    }
  }

  return {
    boost,
    matchedKeywords
  };
}

module.exports = {
  extractWinningKeywords,
  saveWinningKeywords,
  readWinningKeywords,
  getWinningKeywordBoost
};