function normalize(text) {
 return String(text || "")
 .toLowerCase()
 .replace(/[^a-z0-9 ]/g, " ")
 .split(" ")
 .filter(Boolean);
}

function getWordMatchScore(sourceTitle, candidateTitle) {
 const sourceWords = normalize(sourceTitle);
 const candidateWords = normalize(candidateTitle);

 if (!sourceWords.length) return 0;

 let matches = 0;

 sourceWords.forEach((word) => {
 if (candidateWords.includes(word)) {
 matches++;
 }
 });

 return matches / sourceWords.length;
}

function hasUsefulImage(product) {
 return Boolean(
 product &&
 Array.isArray(product.images) &&
 product.images.length > 0 &&
 product.images[0]
 );
}

function isReasonablePrice(product) {
 const price = Number(product.price || 0);

 if (!price || Number.isNaN(price)) return false;

 return price >= 1 && price <= 80;
}

function countSharedKeywords(sourceTitle, candidateTitle, keywords) {
 const sourceLower = String(sourceTitle || "").toLowerCase();
 const candidateLower = String(candidateTitle || "").toLowerCase();

 let count = 0;

 keywords.forEach((word) => {
 if (sourceLower.includes(word) && candidateLower.includes(word)) {
 count++;
 }
 });

 return count;
}

function hasPetIdentity(candidateTitle) {
 const candidateLower = String(candidateTitle || "").toLowerCase();
 const petWords = ["pet", "dog", "cat", "puppy", "kitten"];

 return petWords.some((word) => candidateLower.includes(word));
}

function hasBlockedWords(candidateTitle) {
 const candidateLower = String(candidateTitle || "").toLowerCase();

 const blockedWords = [
 "wooden",
 "furniture",
 "house",
 "table",
 "chair",
 "gift",
 "birthday",
 "bakery",
 "beard",
 "styling",
 "human",
 "decor",
 "frame"
 ];

 return blockedWords.some((word) => candidateLower.includes(word));
}

function getIntentBonus(sourceTitle, candidateTitle) {
 const intentKeywords = [
 "brush",
 "grooming",
 "toy",
 "tunnel",
 "feeder",
 "bowl",
 "fountain",
 "collar",
 "bed",
 "carrier",
 "leash",
 "harness",
 "cleaner",
 "remover",
 "scratcher",
 "litter"
 ];

 const shared = countSharedKeywords(sourceTitle, candidateTitle, intentKeywords);

 if (shared >= 2) return 0.35;
 if (shared === 1) return 0.12;
 return 0;
}

function getMismatchPenalty(sourceTitle, candidateTitle) {
 const sourceLower = String(sourceTitle || "").toLowerCase();
 const candidateLower = String(candidateTitle || "").toLowerCase();

 let penalty = 0;

 const mismatchPairs = [
 { source: "brush", bad: ["beard", "styling"] },
 { source: "tunnel", bad: ["tree", "house", "wooden"] },
 { source: "bowl", bad: ["tree", "house", "frame"] },
 { source: "feeder", bad: ["tree", "frame"] },
 { source: "toy", bad: ["gift", "birthday", "frame"] }
 ];

 mismatchPairs.forEach((rule) => {
 if (sourceLower.includes(rule.source)) {
 rule.bad.forEach((badWord) => {
 if (candidateLower.includes(badWord)) {
 penalty += 0.4;
 }
 });
 }
 });

 return penalty;
}

function scoreCJCandidate(sourceTitle, product) {
 const title = product?.title || "";
 const titleScore = getWordMatchScore(sourceTitle, title);
 const imageScore = hasUsefulImage(product) ? 0.2 : 0;
 const priceScore = isReasonablePrice(product) ? 0.15 : -0.25;
 const intentBonus = getIntentBonus(sourceTitle, title);
 const petIdentityBonus = hasPetIdentity(title) ? 0.25 : -0.35;
 const blockedPenalty = hasBlockedWords(title) ? -0.8 : 0;
 const mismatchPenalty = getMismatchPenalty(sourceTitle, title) * -1;

 const finalScore =
 titleScore +
 imageScore +
 priceScore +
 intentBonus +
 petIdentityBonus +
 blockedPenalty +
 mismatchPenalty;

 return {
 titleScore,
 imageScore,
 priceScore,
 intentBonus,
 petIdentityBonus,
 blockedPenalty,
 mismatchPenalty,
 finalScore
 };
}

function pickBestCJProduct(sourceTitle, candidates) {
 if (!Array.isArray(candidates) || !candidates.length) {
 return null;
 }

 const scored = candidates.map((product) => {
 const score = scoreCJCandidate(sourceTitle, product);
 return {
 ...product,
 selectorScore: score.finalScore,
 selectorBreakdown: score
 };
 });

 scored.sort((a, b) => b.selectorScore - a.selectorScore);

 console.log(
 " CJ candidate ranking:",
 scored.map((p) => ({
 title: p.title,
 selectorScore: p.selectorScore,
 breakdown: p.selectorBreakdown
 }))
 );

 const best = scored[0];

 if (!best) return null;

 if (best.selectorScore < 0.55) {
 return null;
 }

 return best;
}

module.exports = {
 scoreCJCandidate,
 pickBestCJProduct
};