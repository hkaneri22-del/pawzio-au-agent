console.log("📈 TrendScanner module loaded");

const fs = require("fs");
const path = require("path");

const stateFile = path.join(__dirname, "trendScannerState.json");

const trendKeywords = [
  "dog chew toy",
  "slow feeder dog bowl",
  "dog harness",
  "cat tunnel toy",
  "cat feeder bowl",
  "pet grooming brush",
  "pet hair remover",
  "dog leash",
  "pet water fountain",
  "cat litter mat",
  "dog travel bottle",
  "pet cleaning wipes",
  "cat scratching pad",
  "pet carrier bag",
  "dog bed",
  "cat toy ball"
];
function readState() {
try {
if (!fs.existsSync(stateFile)) {
return { lastPoolIndex: -1 };
}
const raw = fs.readFileSync(stateFile, "utf8");
return JSON.parse(raw);
} catch (err) {
return { lastPoolIndex: -1 };
}
}

function writeState(state) {
try {
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), "utf8");
} catch (err) {
console.log("Trend scanner state write failed:", err.message);
}
}

async function scanTrends() {
  console.log("📈 Trend scan running...");

  const state = readState();
  const nextIndex = (state.lastPoolIndex + 1) % trendKeywords.length;

  console.log("📌 Trend keyword index:", nextIndex);

  writeState({
    lastPoolIndex: nextIndex,
    updatedAt: new Date().toISOString()
  });

  const keyword = trendKeywords[nextIndex];

  const generatedProduct = {
    title: keyword
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: `Trending pet product detected for keyword: ${keyword}`,
    trendSource: "Dynamic Trend Scanner",
    trendKeyword: keyword,
    trendScore: 7,
    proofStatus: "pending",
    supplierStatus: "pending",
    supplierLink: null,
    price: "19.99",
    images: []
  };

  console.log("🆕 Generated trend product:", generatedProduct);

  return [generatedProduct];
}

module.exports = {
scanTrends
};