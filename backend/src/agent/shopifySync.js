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
 return null;
 }

 const alreadyExists = await productExistsInShopify(cleanTitle);

 if (alreadyExists) {
 console.log(" Product already exists in Shopify:", cleanTitle);
 return null;
 }



 const pricing = calculatePrice(product.cost || product.price || 0);

 const landingHTML = generateLanding(product);



 const imageArray =
 product.images && product.images.length
 ? [{ src: product.images[0] }]
 : [];



 const payload = {
 product: {
 title: cleanTitle,
 body_html: landingHTML,
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



 const response = await axios.post(
 `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`,
 payload,
 {
 headers: {
 "X-Shopify-Access-Token": SHOPIFY_TOKEN,
 "Content-Type": "application/json",
 },
 }
 );



 console.log(" Shopify product created:", cleanTitle);

 return response.data.product;

 } catch (err) {

 console.log(" Shopify product creation failed");

 if (err.response && err.response.data) {
 console.log(err.response.data);
 } else {
 console.log(err.message);
 }

 return null;
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