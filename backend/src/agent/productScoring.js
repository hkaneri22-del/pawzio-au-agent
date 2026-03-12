console.log("🐶 Pet Product Scoring module loaded");
const { getTrendScore } = require("./trendSignal");

async function scoreProduct(product) {

  let score = 0;
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

const text = ${product.title || ""} ${product.description || ""}.toLowerCase();

for (const keyword of blockedKeywords) {
  if (text.includes(keyword)) {
    console.log("❌ Blocked product:", product.title);
    return -10;
  }
}

  // 1. Demand / Trend (0–25)
  score += (product.demand || 0) * 0.25;

  // 2. Margin (0–20)
  score += (product.margin || 0) * 0.20;

  // 3. Competition (lower = better) (0–15)
  score += ((10 - (product.competition || 0)) * 0.15);

  // 4. Reviews Quality (0–10)
  score += (product.reviews || 0) * 0.10;

  // 5. Refund Risk (lower = better) (0–10)
  score += ((10 - (product.refundRisk || 0)) * 0.10);

  // 6. Shipping Speed (0–10)
  score += (product.shipping || 0) * 0.10;

  // 7. Pet Relevance
 score += (product.petFit || 0) * 0.10;

 // Trend signal
 if (product.title) {
   const trend = await getTrendScore(product.title);
   score += trend * 5;
 }

 return score;
}

module.exports = {
  scoreProduct
};
