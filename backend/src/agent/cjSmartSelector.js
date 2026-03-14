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

function getKeywordBoost(sourceTitle, candidateTitle) {
 const importantWords = [
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
 "seat",
 "bowl",
 "carrier",
 "cleaner",
 "grooming",
 "hair"
 ];

 const sourceLower = String(sourceTitle || "").toLowerCase();
 const candidateLower = String(candidateTitle || "").toLowerCase();

 let boost = 0;

 importantWords.forEach((word) => {
 if (sourceLower.includes(word) && candidateLower.includes(word)) {
 boost += 0.08;
 }
 });

 return boost;
}

function scoreCJCandidate(sourceTitle, product) {
 const title = product?.title || "";
 const titleScore = getWordMatchScore(sourceTitle, title);
 const imageScore = hasUsefulImage(product) ? 0.2 : 0;
 const priceScore = isReasonablePrice(product) ? 0.15 : -0.25;
 const keywordBoost = getKeywordBoost(sourceTitle, title);

 const finalScore = titleScore + imageScore + priceScore + keywordBoost;

 return {
 titleScore,
 imageScore,
 priceScore,
 keywordBoost,
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

 const best = scored[0];

 if (!best) return null;

 if (best.selector