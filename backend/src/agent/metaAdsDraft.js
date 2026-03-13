const fs = require("fs");
const path = require("path");

function generateAdCopy(product) {
const hooks = [
`Pet owners are obsessed with this!`,
`Your pet will love this.`,
`Trending pet product of the week`,
`Smart solution for pet parents`,
];

const hook = hooks[Math.floor(Math.random() * hooks.length)];

return {
primaryText: `${hook} 🐾

${product.title}

✔ Smart design
✔ Loved by pet parents
✔ Limited stock

Order today!`,
headline: `${product.title} – Pet Favorite`,
description: `Upgrade your pet's life with this smart product.`,
};
}

function generateCampaign(product) {
const adCopy = generateAdCopy(product);

return {
campaign: {
name: `Pet Viral – ${product.title}`,
objective: "sales",
status: "PAUSED",
},

adset: {
name: "Pet Lovers – Worldwide",
budget: 10,
optimizationGoal: "conversions",
placements: "automatic",
targeting: {
interests: [
"Pet lovers",
"Dog owners",
"Cat owners",
"Pet products",
],
},
},

ad: {
name: product.title,
creative: {
image: product.image || product.images?.[0] || "",
primaryText: adCopy.primaryText,
headline: adCopy.headline,
description: adCopy.description,
callToAction: "Shop Now",
},
},
};
}

function saveCampaignDraft(product) {
const campaign = generateCampaign(product);

const file = path.join(
__dirname,
"../../data/pending_campaign.json"
);

fs.writeFileSync(file, JSON.stringify(campaign, null, 2));

console.log("AI prepared a campaign for approval...");
console.log("Campaign saved to pending_campaign.json");

return campaign;
}

module.exports = {
saveCampaignDraft,
};