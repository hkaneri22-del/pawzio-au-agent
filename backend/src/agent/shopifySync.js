const axios = require("axios");

console.log("🛍️ ShopifySync module loaded");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

async function createShopifyProduct(product) {
try {
if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
throw new Error("SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN missing");
}

if (!product || !product.title) {
throw new Error("Invalid product object");
}

// Check if product already exists by title
const existing = await axios.get(
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?title=${encodeURIComponent(product.title)}`,
{
headers: {
"X-Shopify-Access-Token": SHOPIFY_TOKEN,
"Content-Type": "application/json"
}
}
);

if (existing.data.products && existing.data.products.length > 0) {
console.log("⚠️ Product already exists in Shopify:", product.title);
return existing.data.products[0];
}

const imageArray =
product.images && product.images.length
? [{ src: product.images[0] }]
: [];

const payload = {
product: {
title: product.title || "AI Pet Product",
body_html: `<strong>${product.description || "Best pet product for your pet!"}</strong>`,
vendor: product.vendor || "Pawzio",
product_type: product.product_type || "Pet Supplies",
status: "draft",
variants: [
{
price: product.price || "19.99"
}
],
images: imageArray
}
};

const response = await axios.post(
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`,
payload,
{
headers: {
"X-Shopify-Access-Token": SHOPIFY_TOKEN,
"Content-Type": "application/json"
}
}
);

console.log("✅ Product created in Shopify:", response.data.product.title);
return response.data.product;

} catch (err) {
console.log("❌ Shopify product creation failed");

if (err.response && err.response.data) {
console.log(err.response.data);
} else {
console.log(err.message);
}

return null;
}
}

async function sync() {
console.log("🛒 Shopify sync running...");
}

module.exports = {
sync,
createShopifyProduct
};
