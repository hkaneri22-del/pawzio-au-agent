console.log(" Pet Product Scoring module loaded");

const { getTrendScore } = require("./trendSignal");
const { getAmazonSignal } = require("./amazonSignal");
const { getTikTokSignal } = require("./tiktokSignal");
const { getMetaSignal } = require("./metaSignal");
const { getMemoryScoreAdjustment } = require("./productMemory");
const { getWinningKeywordBoost } = require("./winningKeywordEngine");

function safeNumber(value, fallback = 0) {
 const num = Number(value);
 return Number.isFinite(num) ? num : fallback;
}

async function scoreProduct(product) {
 let score = 0;

 const title = String(product.title || "");
 const description = String(product.description || "");
 const text = `${title} ${description}`.toLowerCase();

 // Block irrelevant products
 const blockedKeywords = [
 "wooden",
 "coop",
 "cage",
 "chair",
 "table",
 "furniture",
 "cabinet",
 "decor",
 "human"
 ];

 for (const keyword of blockedKeywords) {
 if (text.includes(keyword)) {
 console.log(" Blocked product:", product.title);
 return -10;
 }
 }

 // Winner keywords bonus
 const winnerKeywords = [
 "hair remover",
 "grooming",
 "self cleaning",
 "portable",
 "leak proof",
 "water fountain",
 "brush",
 "travel",
 "cleaner",
 "lick mat"
 ];

 for (const keyword of winnerKeywords) {
 if (text.includes(keyword)) {
 score += 1.5;
 }
 }

 // Bad title / image penalty
 if (!title || title.length < 8) {
 score -= 3;
 }

 if (!product.images || !product.images.length) {
 score -= 4;
 }

 // Price sweet spot
 const price = safeNumber(product.price, 0);
 if (price >= 10 && price <= 35) {
 score += 2;
 } else if (price > 35 && price <= 60) {
 score += 1;
 } else if (price > 60) {
 score -= 2;
 }

 // Core scoring
 score += safeNumber(product.demand) * 0.25;
 score += safeNumber(product.margin) * 0.20;
 score += (10 - safeNumber(product.competition)) * 0.15;
 score += safeNumber(product.reviews) * 0.10;
 score += (10 - safeNumber(product.refundRisk)) * 0.10;
 score += safeNumber(product.shipping) * 0.10;
 score += safeNumber(product.petFit) * 0.10;

 // Trend signal
 let trend = 0;
 try {
 trend = safeNumber(await getTrendScore(title), 0);
 } catch (err) {
 console.log(" Trend score failed:", err.message);
 }
 score += trend * 5;

 // Amazon signal
 const amazon = safeNumber(getAmazonSignal(title), 0);
 score += amazon * 3;

 // TikTok signal
 const tiktok = safeNumber(getTikTokSignal(title), 0);
 score += tiktok * 4;

 // Meta signal
 const meta = safeNumber(getMetaSignal(title), 0);
 score += meta * 4;
 const winningKeyword = getWinningKeywordBoost(title);
score += winningKeyword.boost;
 const memory = getMemoryScoreAdjustment(title);
score += memory.adjustment;

 // Final guard
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
  finalScore: score
});

 return Number(score.toFixed(2));
}

module.exports = {
 scoreProduct
};