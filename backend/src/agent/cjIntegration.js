const axios = require("axios");

console.log("📦 CJ Integration module loaded");

const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

async function syncOrders() {
console.log("📦 CJ order sync running...");
}

async function searchCJProductByKeyword(keyword) {
try {
console.log("🔎 Searching CJ product for:", keyword);

const response = await axios.get(
`https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(keyword)}`,
{
headers: {
"CJ-Access-Token": CJ_ACCESS_TOKEN
}
}
);

const list = response.data?.data?.list || [];

if (!list.length) {
console.log("⚠️ No CJ product found for:", keyword);
return null;
}

return list[0];
} catch (err) {
console.log("❌ CJ product search failed");
console.log(err.response?.data || err.message);
return null;
}
}

function normalizeCJProduct(cjProduct) {
return {
title: cjProduct.productName || "CJ Product",
description: cjProduct.description || "CJ Dropshipping product",
price: cjProduct.sellPrice || cjProduct.variants?.[0]?.sellPrice || "19.99",
images: cjProduct.productImage ? [cjProduct.productImage] : [],
cjProductId: cjProduct.pid || cjProduct.id || null
};
}

module.exports = {
syncOrders,
searchCJProductByKeyword,
normalizeCJProduct
};