console.log("📦 Shopify payload title:", cleanTitle);
console.log("📦 Shopify payload image count:", imageArray.length);
console.log("📦 Shopify payload first image:", imageArray[0]?.src || "none");

const axios = require("axios");
const { calculatePrice } = require("./pricingEngine");
const { generateLanding } = require("./landingGenerator");

console.log(" ShopifySync module loaded");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;



// CHECK IF PRODUCT ALREADY EXISTS
async function productExistsInShopify(title) {
 try {

 const newTitle = String(title || "").trim().toLowerCase();

 if (!newTitle) return false;

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
 return existingTitle === newTitle;
 });

 } catch (err) {

 console.log(" Shopify duplicate check failed");
 console.log(err.response?.data || err.message);

 return false;
 }
}




// CREATE PRODUCT IN SHOPIFY
async function createShopifyProduct(product) {

 const cleanTitle = String(product?.title || "").trim();

 try {

 if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
 throw new Error("SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN missing");
 }

 if (!product || !product.title) {
 throw new Error("Invalid product object");
 }

 if (!cleanTitle) {
 console.log(" Empty title, skipping Shopify create");
 return {
  success: false,
  title: "",
  status: "invalid",
  handle: null,
  url: null
};
 }

 const alreadyExists = await productExistsInShopify(cleanTitle);

 if (alreadyExists) {
 console.log(" Product already exists in Shopify:", cleanTitle);

 return {
   success: true,
   title: cleanTitle,
   status: "existing",
   handle: null,
   url: null,
   existing: true
 };
}


 const pricing = calculatePrice(product.cost || product.price || 0);

const cleanTitle = product.title || "Untitled Product"; // ✅ ADD THIS

const supplierHTML = product.supplierLink
? `<div style="margin-top:20px;">
<a href="${product.supplierLink}" target="_blank"
style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
🔗 View Supplier
</a>
</div>`
: "";

return {
product: {
title: cleanTitle,
body_html: landingHTML + supplierHTML,
...
}
};

const landingHTML = generateLanding(product);

const validImage =
  Array.isArray(product.images) &&
  product.images.length &&
  typeof product.images[0] === "string" &&
  product.images[0].startsWith("http")
    ? product.images[0]
    : "";

const imageArray = validImage ? [{ src: validImage }] : [];

console.log("🖼 Shopify image selected:", validImage || "none");

const payload = {
  product: {
    title: cleanTitle,
    body_html: landingHTML + supplierHTML,
    vendor: product.vendor || "Pawzio",
    product_type: product.product_type || "Pet Supplies",
    tags: "AI_IMPORTED,CJ_PRODUCT,REVIEW_PENDING",
    status: "draft",
    variants: [
      {
        price: pricing.price,
        compare_at_price: pricing.compare_at_price,
        sku: `PZ-${Date.now()}`,
        inventory_management: "shopify",
        inventory_policy: "deny",
      },
    ],
    images: imageArray,
  },
};



 const createdProduct = response.data.product;

console.log(" Shopify product created:", cleanTitle);

return {
success: true,
title: cleanTitle,
id: createdProduct.id || null,
handle: createdProduct.handle || null,
status: createdProduct.status || "draft",
url:
createdProduct.handle
? `https://${SHOPIFY_STORE}/products/${createdProduct.handle}`
: null
};

 } catch (err) {

 console.log(" Shopify product creation failed");

 if (err.response && err.response.data) {
 console.log(err.response.data);
 } else {
 console.log(err.message);
 }

 return {
  success: false,
  title: cleanTitle,
  id: null,
  handle: null,
  status: "failed",
  url: null,
  error: err.message
};
 }
}




// SYNC FUNCTION
async function sync() {

 console.log(" Shopify sync running...");

}



// EXPORT MODULE
module.exports = {
 sync,
 createShopifyProduct,
};

