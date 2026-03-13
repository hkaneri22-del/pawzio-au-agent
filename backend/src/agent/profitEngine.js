function estimateSellingPrice(cost) {
if (!cost) return 0;

const costNum = Number(cost);

if (costNum <= 3) return 14.99;
if (costNum <= 5) return 19.99;
if (costNum <= 8) return 24.99;
if (costNum <= 12) return 29.99;
if (costNum <= 18) return 39.99;

return costNum * 2.5;
}

function estimateAdCost() {
return 12;
}

function analyzeProfit(product) {
const cost = Number(product.price || product.cost || 0);
const sellingPrice = estimateSellingPrice(cost);
const adCost = estimateAdCost();
const shipping = 4;

const totalCost = cost + shipping + adCost;
const profit = sellingPrice - totalCost;

const margin = sellingPrice > 0
? ((profit / sellingPrice) * 100)
: 0;

return {
cost,
sellingPrice,
adCost,
shipping,
totalCost,
profit,
margin
};
}

function isProfitable(product) {
const analysis = analyzeProfit(product);

if (analysis.margin < 25) {
return {
pass: false,
analysis
};
}

return {
pass: true,
analysis
};
}

module.exports = {
analyzeProfit,
isProfitable
};