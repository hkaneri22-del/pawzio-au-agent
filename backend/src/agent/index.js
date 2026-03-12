console.log("INDEX TEST 123");
console.log(" AI Agent index.js loaded");

require("dotenv").config();

(async () => {

 try {

 console.log(" AI Agent starting up...");

 // Load modules
 const productScanner = require("./productScanner");
 const shopifySync = require("./shopifySync");
 const cjIntegration = require("./cjIntegration");
 const adsManager = require("./adsManager");
 const orderManager = require("./orderManager");
 const reports = require("./reports");
 const productResearch = require("./productResearch");
 const { scoreProduct } = require("./productScoring");

 console.log(" All modules loaded successfully");

 // Run every 60 seconds
 setInterval(async () => {

 try {

 console.log(" Heartbeat - running AI tasks...");

 const researched = await productScanner.scan();

 if (researched && researched.length) {

 console.log(" Scoring pet products...");

 const ranked = researched
 .map(p => {
 p.score = scoreProduct(p);
 return p;
 })
 .sort((a, b) => b.score - a.score);

 console.log(" Top Pet Products:");
 console.log(ranked.slice(0, 3));

 for (let product of ranked.slice(0, 1)) {
 try {
 if (!product.title || product.title.length < 5) {
 console.log(" Invalid product title, skipping");
 continue;
 }

 console.log(" Trying CJ match for:", product.title);

 const cjRaw = await cjIntegration.searchCJProductByKeyword(product.title);

 if (!cjRaw) {
 console.log(" No CJ match, skipping:", product.title);
 continue;
 }

 const cjProduct = cjIntegration.normalizeCJProduct(cjRaw);

 if (!cjProduct || !cjProduct.title) {
 console.log(" Invalid CJ product, skipping");
 continue;
 }

 if (!cjProduct.images || !cjProduct.images.length) {
 console.log(" No CJ image found, skipping:", cjProduct.title);
 continue;
 }

 console.log(" CJ match found:", cjProduct.title);
 console.log(" CJ image:", cjProduct.images[0]);

 await createShopifyProduct(cjProduct);

 break;
 } catch (loopErr) {
 console.log(" Product loop error:");
 console.log(loopErr.message);
 }
}

 // Run automation tasks
 await shopifySync.sync();
 await cjIntegration.syncOrders();
 await adsManager.optimize();
 await orderManager.process();
 await reports.weekly();
 await productResearch.scanTrends();

 }

 } catch (loopErr) {

 console.error(" ERROR inside main loop:", loopErr);

 }

 }, 3600000);

 } catch (err) {

 console.error(" FATAL STARTUP ERROR:", err);

 }

})();