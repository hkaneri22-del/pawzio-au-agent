const fs = require("fs");
const path = require("path");

const CANDIDATES_PATH = path.join(__dirname, "viralCandidates.json");

function safeNumber(value, fallback = 0) {
const num = Number(value);
return Number.isFinite(num) ? num : fallback;
}

function getViralTag(product) {
const title = String(product.title || "").toLowerCase();
const description = String(product.description || "").toLowerCase();
const text = `${title} ${description}`;

const viralPatterns = [
"pet hair remover",
"self cleaning brush",
"interactive toy",
"lick mat",
"portable pet bottle",
"pet water fountain",
"dog grooming",
"cat brush",
"fur remover",
"odor remover",
"travel bowl",
"leak proof",
"smart pet"
];

const matched = viralPatterns.filter((kw) => text.includes(kw));

return {
matchedKeywords: matched,
isViralStyle: matched.length > 0
};
}

function buildCandidate(product) {
const score = safeNumber(product.score, 0);
const { matchedKeywords, isViralStyle } = getViralTag(product);

return {
title: product.title || "",
description: product.description || "",
price: product.price || product.cost || "",
images: product.images || [],
score,
matchedKeywords,
isViralStyle,
tested: false,
createdAt: new Date().toISOString()
};
}

function saveViralCandidates(products) {
try {
const candidates = products.map(buildCandidate);

fs.writeFileSync(
CANDIDATES_PATH,
JSON.stringify(candidates, null, 2),
"utf8"
);

console.log("💾 Viral candidates saved:", candidates.length);
return candidates;
} catch (err) {
console.log("❌ Failed to save viral candidates");
console.log(err.message);
return [];
}
}

module.exports = {
getViralTag,
buildCandidate,
saveViralCandidates
};