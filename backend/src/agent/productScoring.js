console.log("Pet Product Scoring module loaded");

const { getTrendScore } = require("./trendSignal");
const { getAmazonSignal } = require("./amazonSignal");
const { getTikTokSignal } = require("./tiktokSignal");
const { getMetaSignal } = require("./metaSignal");
const { getWinningKeywordBoost } = require("./winningKeywordEngine");
const productMemory = require("./productMemory");

function safeNumber(value, fallback = 0) {
const num = Number(value);
return Number.isFinite(num) ? num : fallback;
}

async function scoreProduct(product) {
let score = 0;

const title = String(product?.title || "").trim();
const description = String(product?.description || "").trim();
const text = `${title} ${description}`.toLowerCase();
const price = safeNumber(product?.price || product?.cost, 0);

// Block irrelevant products early
const blockedKeywords = [
"wooden",
"coop",
"cage",
"furniture",
"home decor",
"sofa",
"cabinet",
"table",
"chair"
];

for (const kw of blockedKeywords) {
if (text.includes(kw)) {
console.log("Blocked product in scoring:", title, "keyword:", kw);
return 0;
}
}

// Base score from title quality
if (title.length >= 8) score += 2;
if (description.length >= 20) score += 1;

// Price logic
if (price > 0 && price <= 50) score += 1;
if (price >= 10 && price <= 35) score += 1.5;

// Trend signal
let trend = 0;
try {
trend = safeNumber(await getTrendScore(title), 0);
} catch (err) {
console.log("Trend signal fallback:", err.message);
trend = 0;
}
score += trend * 5;

// Amazon signal
let amazon = 0;
try {
amazon = safeNumber(getAmazonSignal(title), 0);
} catch (err) {
console.log("Amazon signal fallback:", err.message);
amazon = 0;
}
score += amazon * 3;

// TikTok signal
let tiktok = 0;
try {
tiktok = safeNumber(getTikTokSignal(title), 0);
} catch (err) {
console.log("TikTok signal fallback:", err.message);
tiktok = 0;
}
score += tiktok * 4;

// Meta signal
let meta = 0;
try {
meta = safeNumber(getMetaSignal(title), 0);
} catch (err) {
console.log("Meta signal fallback:", err.message);
meta = 0;
}
score += meta * 4;

// Winning keyword boost
let winningKeyword = { boost: 0, matchedKeywords: [] };
try {
winningKeyword = getWinningKeywordBoost(title) || {
boost: 0,
matchedKeywords: []
};
} catch (err) {
console.log("Winning keyword fallback:", err.message);
winningKeyword = { boost: 0, matchedKeywords: [] };
}
score += safeNumber(winningKeyword.boost, 0);

// Memory-aware scoring (SAFE)
let memory = {
boost: 0,
penalty: 0,
adjustment: 0,
successfulPatternHits: 0,
rejectedPatternHits: 0,
blockedPatternHits: 0
};

try {
if (
productMemory &&
typeof productMemory.getMemoryScoreAdjustment === "function"
) {
memory = productMemory.getMemoryScoreAdjustment(title) || memory;
score += safeNumber(memory.adjustment, 0);
} else {
console.log("Memory scoring skipped: getMemoryScoreAdjustment not available");
}
} catch (err) {
console.log("Memory scoring fallback:", err.message);
}

score = safeNumber(score, 0);

console.log("Score breakdown:", {
title,
basePrice: price,
trend,
amazon,
tiktok,
meta,
winningKeywordBoost: winningKeyword.boost,
matchedWinningKeywords: winningKeyword.matchedKeywords,
memoryBoost: memory.boost,
memoryPenalty: memory.penalty,
memoryAdjustment: memory.adjustment,
successfulPatternHits: memory.successfulPatternHits,
rejectedPatternHits: memory.rejectedPatternHits,
blockedPatternHits: memory.blockedPatternHits,
finalScore: Number(score.toFixed(2))
});

return Number(score.toFixed(2));
}

module.exports = {
scoreProduct
};