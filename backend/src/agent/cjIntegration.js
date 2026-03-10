const axios = require("axios");

console.log("📦 CJ Integration module loaded");

const CJ_ACCESS_TOKEN = (process.env.CJ_ACCESS_TOKEN || process.env.CJ_API_KEY || "").trim();

console.log("CJ TOKEN EXISTS:", !!CJ_ACCESS_TOKEN);
console.log("CJ TOKEN PREFIX:", CJ_ACCESS_TOKEN ? CJ_ACCESS_TOKEN.slice(0, 8) : "NO TOKEN");

async function searchCJProductByKeyword(keyword) {
try {
console.log("🔎 Searching CJ product for:", keyword);

if (!CJ_ACCESS_TOKEN) {
throw new Error("CJ access token missing");
}

const response = await axios.get(
`https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(keyword)}`,
{
headers: {
"CJ-Access-Token": CJ_ACCESS_TOKEN
}
}
);

const list = response?.data?.data?.list || [];

if (!list.length) {
console.log("⚠️ No CJ product found for:", keyword);
return null;
}

return list[0];
} catch (err) {
console.log("❌ CJ product search failed");

if (err.response?.data) {
console.log(err.response.data);
} else {
console.log(err.message);
}

return null;
}
}

function normalizeCJProduct(cjRaw) {
return {
title: cjRaw.productName || "CJ Product",
description: cjRaw.description || "Imported from CJ Dropshipping",
price: cjRaw.sellPrice || cjRaw.variants?.[0]?.sellPrice || "19.99",
images: cjRaw.productImage ? [cjRaw.productImage] : [],
vendor: "CJ Dropshipping",
product_type: "Pet Supplies"
};
}

async function syncOrders() {
console.log("📦 CJ order sync running...");
}

module.exports = {
searchCJProductByKeyword,
normalizeCJProduct,
syncOrders
};