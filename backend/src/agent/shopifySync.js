const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

console.log("STORE:", SHOPIFY_STORE);
console.log("TOKEN LENGTH:", SHOPIFY_TOKEN ? SHOPIFY_TOKEN.length : "NO TOKEN");
console.log("TOKEN PREFIX:", SHOPIFY_TOKEN ? SHOPIFY_TOKEN.slice(0, 5) : "NO");

async function findProductByTitle(title) {
  try {
    const response = await axios.get(
      https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?title=${encodeURIComponent(title)},
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const products = response.data.products || [];
    return products.find(
      (p) => (p.title || "").trim().toLowerCase() === title.trim().toLowerCase()
    ) || null;
  } catch (err) {
    console.log("❌ Shopify product search failed");
    console.log(err.response?.data || err.message);
    return null;
  }
}

async function createShopifyProduct(product) {
  try {
    // 1. duplicate check
    const existing = await findProductByTitle(product.title);

    if (existing) {
      console.log("⚠️ Product already exists in Shopify:", product.title);
      return existing;
    }

    // 2. create only if not exists
    const response = await axios.post(
      https://${SHOPIFY_STORE}/admin/api/2023-10/products.json,
      {
        product: {
          title: product.title || "AI Pet Product",
          body_html: <strong>${product.description || "Best pet product for your pet!"}</strong>,
          vendor: "Pawzio",
          product_type: "Pet Supplies",
          status: "active",
          variants: [
            {
              price: product.price || "19.99",
            },
          ],
          images: product.images
            ? product.images.map((img) => ({ src: img }))
            : [],
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Product created in Shopify:", response.data.product.title);
    return response.data.product;
  } catch (err) {
    console.log("❌ Shopify product creation failed");
    console.log(err.response?.data || err.message);
    return null;
  }
}

async function sync() {
  console.log("🛍️ Shopify sync running...");
}

module.exports = {
  sync,
  createShopifyProduct,
  findProductByTitle,
};