function normalize(text) {
 return String(text || "")
 .toLowerCase()
 .replace(/[^a-z0-9 ]/g, "")
 .split(" ")
 .filter(Boolean);
}

function scoreMatch(shopifyTitle, cjTitle) {
 const shopifyWords = normalize(shopifyTitle);
 const cjWords = normalize(cjTitle);

 if (!shopifyWords.length) return 0;

 let matches = 0;

 shopifyWords.forEach((word) => {
 if (cjWords.includes(word)) {
 matches++;
 }
 });

 return matches / shopifyWords.length;
}

function isGoodCJMatch(shopifyTitle, cjTitle) {
 const shopifyLower = String(shopifyTitle || "").toLowerCase();
 const cjLower = String(cjTitle || "").toLowerCase();

 const strongKeywords = [
 "sofa",
 "bed",
 "fountain",
 "collar",
 "feeder",
 "Seat",
 "litter",
 "scratcher",
 "toy",
 "brush",
 "grooming",
 "cleaner",
 "remover",
 "carrier",
 "bowl"
 ];

 const importantMatch = strongKeywords.some((word) =>
 shopifyLower.includes(word) && cjLower.includes(word)
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