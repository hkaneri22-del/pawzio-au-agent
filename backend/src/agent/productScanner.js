console.log("📦 ProductScanner module loaded");

const fs = require("fs");
const path = require("path");

const stateFile = path.join(__dirname, "scannerState.json");

const keywordPools = [
[
{
title: "Interactive Dog Chew Toy",
description: "Durable chew toy for active dogs.",
price: "18.99",
images: [
"https://m.media-amazon.com/images/I/71wTQzJQeVL._AC_SL1500_.jpg"
]
},
{
title: "Slow Feeder Dog Bowl",
description: "Anti-choke slow feeder bowl for dogs.",
price: "12.99",
images: [
"https://m.media-amazon.com/images/I/71nQd1kM7CL._AC_SL1500_.jpg"
]
},
{
title: "Dog Harness Set",
description: "Adjustable dog harness with leash.",
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
price: "22.99",
images: [
"https://m.media-amazon.com/images/I/71K8sKQw2jL._AC_SL1500_.jpg"
]
},
{
title: "Cat Feeder Bowl",
description: "Minimal cat feeder bowl set.",
price: "13.99",
images: [
"https://m.media-amazon.com/images/I/61sQ9m5d3xL._AC_SL1200_.jpg"
]
},
{
title: "Cat Scratching Pad",
description: "Durable scratching pad for cats.",
price: "16.99",
images: [
"https://m.media-amazon.com/images/I/71n6HqR2cBL._AC_SL1500_.jpg"
]
}
],
[
{
title: "Pet Grooming Brush",
description: "Easy fur removal brush for pets.",
price: "16.99",
images: [
"https://m.media-amazon.com/images/I/71f4zXw8mLL._AC_SL1500_.jpg"
]
},
{
title: "Pet Travel Water Bottle",
description: "Portable water bottle for dogs and cats.",
price: "15.99",
images: [
"https://m.media-amazon.com/images/I/61bG4WkPj-L._AC_SL1500_.jpg"
]
},
{
title: "Pet Cleaning Wipes Box",
description: "Pet-safe wipes for paws and fur cleaning.",
price: "11.99",
images: [
"https://m.media-amazon.com/images/I/61h2C8mQFAL._AC_SL1200_.jpg"
]
}
],
[
{
title: "LED Dog Collar",
description: "Rechargeable glowing dog collar for night safety.",
price: "14.99",
images: [
"https://m.media-amazon.com/images/I/61Z9ZzF9EJL._AC_SL1000_.jpg"
]
},
{
title: "Automatic Pet Water Fountain",
description: "Smart water fountain for cats and dogs with filtration.",
price: "29.99",
images: [
"https://m.media-amazon.com/images/I/61K8F6H6yQL._AC_SL1200_.jpg"
]
},
{
title: "Smart Pet Hair Remover",
description: "Reusable pet hair remover for sofa, carpet and clothes.",
price: "19.99",
images: [
"https://m.media-amazon.com/images/I/71hKQqv2qXL._AC_SL1500_.jpg"
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
const parsed = JSON.parse(raw);
return {
lastPoolIndex:
typeof parsed.lastPoolIndex === "number" ? parsed.lastPoolIndex : -1
};
} catch (err) {
console.log("Scanner state read failed:", err.message);
return { lastPoolIndex: -1 };
}
}

function writeState(state) {
try {
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), "utf8");
} catch (err) {
console.log("Scanner state write failed:", err.message);
}
}

async function scan() {
console.log("🔍 Product scan running...");

const state = readState();
const nextPoolIndex = (state.lastPoolIndex + 1) % keywordPools.length;

console.log("🔑 Scanner pool index:", nextPoolIndex);

writeState({
lastPoolIndex: nextPoolIndex,
updatedAt: new Date().toISOString()
});

return keywordPools[nextPoolIndex];
}

module.exports = {
scan
};