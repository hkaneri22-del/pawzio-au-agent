const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

async function createShopifyProduct(product) {

try {

const response = await axios.post(
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`,
{
product: {
title: product.title || "AI Pet Product",
body_html: `<strong>${product.description || "Best pet product for your pet!"}</strong>`,
vendor: "Pawzio",
product_type: "Pet Supplies",
status: "active",
variants: [
{
price: product.price || "19.99"
}
],
images: product.images
? product.images.map(img => ({ src: img }))
: []
}
},
{
headers: {
"X-Shopify-Access-Token": SHOPIFY_TOKEN,
"Content-Type": "application/json"
}
}
);

console.log("✅ Product created in Shopify:", response.data.product.title);

} catch (err) {

console.log("❌ Shopify product creation failed");
console.log(err.response?.data || err.message);

}
}

async function sync() {
console.log("🛍 Shopify sync running...");
}

module.exports = {
sync,
createShopifyProduct
};
