const fs = require("fs");
const path = require("path");

function buildHooks(productTitle) {
return [
`Pet owners are switching to this: ${productTitle}`,
`Why is everyone buying ${productTitle}?`,
`This ${productTitle} is going viral for pet parents`
];
}

function buildPrimaryTexts(productTitle) {
return [
`${productTitle} is making life easier for pet parents.

✔ Easy to use
✔ Smart design
✔ Loved by pets

Try it today.`,
`If you love smart pet products, you should see ${productTitle}.

Designed for convenience, comfort, and daily use.`,
`Trending pet product alert 🚀

${productTitle} is getting attention for all the right reasons.`
];
}

function buildHeadlines(productTitle) {
return [
`${productTitle} – Pet Favorite`,
`Upgrade Your Pet Routine`,
`Trending Pet Product`
];
}

function buildCreativeIdeas(productTitle) {
return [
{
type: "image",
idea: `${productTitle} close-up product shot with clean background`
},
{
type: "video",
idea: `Pet owner using ${productTitle} in a real home setting`
},
{
type: "ugc",
idea: `UGC-style reaction video showing why ${productTitle} is useful`
}
];
}

function buildUGCScript(productTitle) {
return {
hook: `I didn’t expect this ${productTitle} to be this useful...`,
body: [
`I found ${productTitle} and decided to try it for my pet.`,
`Honestly, it made things much easier almost immediately.`,
`It looks good, feels practical, and my pet actually likes it.`,
`Definitely one of those products you wish you had bought earlier.`
],
cta: `If you’ve been thinking about getting ${productTitle}, now is a good time to try it.`
};
}

function generateCreativePack(product) {
const productTitle = product.title || "Pet Product";

return {
productTitle,
hooks: buildHooks(productTitle),
primaryTexts: buildPrimaryTexts(productTitle),
headlines: buildHeadlines(productTitle),
creativeIdeas: buildCreativeIdeas(productTitle),
ugcScript: buildUGCScript(productTitle),
image: product.image || (product.images && product.images[0]) || ""
};
}

function saveCreativeDraft(product) {
const creativePack = generateCreativePack(product);

const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
fs.mkdirSync(dataDir, { recursive: true });
}

const file = path.join(dataDir, "pending_creatives.json");
fs.writeFileSync(file, JSON.stringify(creativePack, null, 2), "utf8");

console.log("AI generated creative pack for approval...");
console.log("Creative draft saved to pending_creatives.json");

return creativePack;
}

module.exports = {
saveCreativeDraft
};
