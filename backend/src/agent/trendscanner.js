console.log("📈 TrendScanner module loaded");

const fs = require("fs");
const path = require("path");

const stateFile = path.join(__dirname, "trendScannerState.json");

const trendPools = [
[
{
title: "Interactive Dog Chew Toy",
description: "Durable chew toy for active dogs.",
trendSource: "TikTok Creative Center",
trendKeyword: "dog chew toy",
trendScore: 8,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "18.99",
images: [
"https://m.media-amazon.com/images/I/71wTQzJQeVL._AC_SL1500_.jpg"
]
},
{
title: "Slow Feeder Dog Bowl",
description: "Anti-choke slow feeder bowl for dogs.",
trendSource: "Minea",
trendKeyword: "slow feeder bowl",
trendScore: 7,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "12.99",
images: [
"https://m.media-amazon.com/images/I/71nQd1kM7CL._AC_SL1500_.jpg"
]
},
{
title: "Dog Harness Set",
description: "Adjustable dog harness with leash.",
trendSource: "TikTok Creative Center",
trendKeyword: "dog harness",
trendScore: 7,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "24.99",
images: [
"https://m.media-amazon.com/images/I/71mV8mF0d8L._AC_SL1500_.jpg"
]
}
],
[
{
title: "Cat Tunnel Toy",
description: "Interactive cat tunnel for indoor cats.",
trendSource: "Minea",
trendKeyword: "cat tunnel toy",
trendScore: 8,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "22.99",
images: [
"https://m.media-amazon.com/images/I/71K8sKQw2jL._AC_SL1500_.jpg"
]
},
{
title: "Cat Feeder Bowl",
description: "Minimal cat feeder bowl set.",
trendSource: "TikTok Creative Center",
trendKeyword: "cat feeder bowl",
trendScore: 7,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "13.99",
images: [
"https://m.media-amazon.com/images/I/61sQ9m5d3xL._AC_SL1200_.jpg"
]
},
{
title: "Pet Grooming Brush",
description: "Easy fur removal brush for pets.",
trendSource: "Minea",
trendKeyword: "pet grooming brush",
trendScore: 7,
proofStatus: "pending",
supplierStatus: "pending",
supplierLink: null,
price: "16.99",
images: [
"https://m.media-amazon.com/images/I/71f4zXw8mLL._AC_SL1500_.jpg"
]
}
]
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
const nextPoolIndex = (state.lastPoolIndex + 1) % trendPools.length;

console.log("📌 Trend pool index:", nextPoolIndex);

writeState({
lastPoolIndex: nextPoolIndex,
updatedAt: new Date().toISOString()
});

return trendPools[nextPoolIndex];
}

module.exports = {
scanTrends
};