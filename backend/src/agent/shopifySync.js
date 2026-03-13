const axios = require("axios");
const { calculatePrice } = require("./pricingEngine");
const { generateLanding } = require("./landingGenerator");
async function productExistsInShopify(title) {
try {
const cleanTitle = String(product.title || "").trim();

if (!cleanTitle) {
console.log("⚠️ Empty title, skipping Shopify create");
return;
}

const alreadyExists = await productExistsInShopify(cleanTitle);

if (alreadyExists) {
console.log("⚠️ Product already exists in Shopify:", cleanTitle);
return;
}

if (!title) return false;

const response = await axios.get(
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?title=${encodeURIComponent(title)}`,
{
headers: {
"X-Shopify-Access-Token": SHOPIFY_TOKEN,
"Content-Type": "application/json",
},
}
);

const products = response.data?.products || [];

return products.some((p) => {
const existingTitle = String(p.title || "").trim().toLowerCase();
const newTitle = String(title || "").trim().toLowerCase();
return existingTitle === newTitle;
});
} catch (err) {
console.log("⚠️ Shopify duplicate check failed");
console.log(err.response?.data || err.message);
return false;
}
}


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

const pricing = calculatePrice(product.price || 5);

const landingHTML = generateLanding(product);

const payload = {
  product: {
    title: cleanTitle || "AI Pet Product",
    body_html: landingHTML,

    vendor: "Pawzio",
    product_type: "Pet Product",

    tags: "AI_IMPORTED,PAWZIO,WINNING_PRODUCT",
metafields: [
  {
    key: "seo_title",
    value: product.title,
    type: "single_line_text_field",
    namespace: "seo"
  }
],
    status: "draft",

    variants: [
      {
        price: pricing.price,
        compare_at_price: pricing.compare_at_price,
        sku: `PZ-${Date.now()}`,

        inventory_management: "shopify",
        inventory_policy: "deny"
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
