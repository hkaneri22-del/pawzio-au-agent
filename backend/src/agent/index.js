console.log("INDEX TEST 123");
console.log("AI Agent index.js loaded");

require("dotenv").config();

(async () => {
 try {
 console.log("AI Agent starting up...");

 // Load modules
 const productScanner = require("./productScanner");
 const cjIntegration = require("./cjIntegration");
 const adsManager = require("./adsManager");
 const orderManager = require("./orderManager");
 const reports = require("./reports");
 const productResearch = require("./productResearch");
 const { scoreProduct } = require("./productScoring");
 const { createShopifyProduct } = require("./shopifySync");
 const { isProfitable } = require("./profitEngine");
 const { saveViralCandidates } = require("./viralDiscovery");
 const { getNextViralCandidates, markCandidateTested } = require("./viralQueue");
 const productMemory = require("./productMemory");
 const { saveWinningKeywords } = require("./winningKeywordEngine");
 const { saveCampaignDraft } = require("./metaAdsDraft");
 const { saveCreativeDraft } = require("./autoAdCreativeEngine");
 const { isGoodCJMatch } = require("./cjSmartMatch");
 const { pickBestCJProduct } = require("./cjSmartSelector");

 console.log("All modules loaded successfully");

 // Run every 60 seconds
 setInterval(async () => {
 try {
 console.log("Heartbeat - running AI tasks...");

 const researched = await productScanner.scan();

 if (researched && researched.length) {
 console.log("Scoring pet products...");

 const scoredProducts = await Promise.all(
 researched.map(async (p) => {
 p.score = await scoreProduct(p);
 return p;
 })
 );

 const ranked = scoredProducts.sort((a, b) => b.score - a.score);

 console.log(" Top Pet Products:");
 console.log(ranked.slice(0, 3));

 const shortlisted = ranked.filter((p) => p.score >= 5);

 console.log(" Winning Product Shortlist:");
 console.log(shortlisted.slice(0, 5));

 if (!shortlisted.length) {
 console.log(" No winning products found in this cycle");
 }

 const freshShortlisted = shortlisted.filter((p) => {
  if (
    productMemory &&
    typeof productMemory.shouldSkipProduct === "function"
  ) {
    return !productMemory.shouldSkipProduct(p.title);
  }
  return true;
});

console.log("Fresh shortlist after memory filter:");
console.log(freshShortlisted);

saveViralCandidates(freshShortlisted.slice(0, 10));
 saveWinningKeywords();

 const queuedCandidates = getNextViralCandidates(3);

 console.log(" Viral Queue Candidates:");
 console.log(queuedCandidates);

 const processingList = queuedCandidates.length
 ? queuedCandidates
 : freshShortlisted.slice(0, 2);

 for (let product of processingList) {
 try {
 if (
 productMemory &&
 typeof productMemory.shouldSkipProduct === "function" &&
 productMemory.shouldSkipProduct(product.title)
 ) {
 console.log(" Memory says skip:", product.title);
 continue;
 }

 if (!product.title || product.title.length < 5) {
 console.log("Invalid product title, skipping");

 if (
 productMemory &&
 typeof productMemory.addMemoryRecord === "function"
 ) {
 productMemory.addMemoryRecord({
 title: product.title || "",
 status: "rejected",
 reason: "invalid_title",
 score: product.score || 0,
 source: "shortlist"
 });
 }
 markCandidateTested(product.title);
 continue;
 }

 console.log("Trying CJ match for:", product.title);

 const cjRaw = await cjIntegration.searchCJProductByKeyword(product.title);
 await new Promise(resolve => setTimeout(resolve, 1200));
 if (!cjRaw) {
  console.log("CJ search returned no product, skipping:", product.title);

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product.title,
      status: "rejected",
      reason: "cj_search_empty",
      score: product.score || 0,
      source: "cj_search"
    });
  }

  markCandidateTested(product.title);
  continue;
}

const cjCandidates = Array.isArray(cjRaw) ? cjRaw : [cjRaw];

const normalizedCandidates = cjCandidates
  .map((item) => {
    try {
      return cjIntegration.normalizeCJProduct(item);
    } catch (err) {
      return null;
    }
  })
  .filter(Boolean);

const cjProduct = pickBestCJProduct(product.title, normalizedCandidates);

if (!cjProduct) {
  console.log("No strong CJ product selected, skipping:", product.title);

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product.title,
      status: "rejected",
      reason: "no_strong_cj_product",
      score: product.score || 0,
      source: "cj_selector"
    });
  }

  markCandidateTested(product.title);
  continue;
}
console.log("CJ selector chose:", cjProduct.title);

 if (!cjProduct || !cjProduct.title) {
 console.log("Invalid CJ product, skipping");

 if (
 productMemory &&
 typeof productMemory.addMemoryRecord === "function"
 ) {
 productMemory.addMemoryRecord({
 title: product.title,
 status: "rejected",
 reason: "invalid_cj_product",
 score: product.score || 0,
 source: "cj_normalize"
 });
 }
 markCandidateTested(product.title);
 continue;
 }

 if (!cjProduct.images || !cjProduct.images.length) {
 console.log("No CJ image found, skipping:", cjProduct.title);

 if (
 productMemory &&
 typeof productMemory.addMemoryRecord === "function"
 ) {
 productMemory.addMemoryRecord({
 title: product.title,
 status: "rejected",
 reason: "no_cj_image",
 score: product.score || 0,
 source: "cj_product",
 cjTitle: cjProduct.title || ""
 });
 }
 markCandidateTested(product.title);
 continue;
 }

 const blockedKeywords = [
 "wooden",
 "coop",
 "cage",
 "furniture",
 "home decor",
 "sofa",
 "cabinet",
 "table",
 "chair"
 ];

 const allowedKeywords = [
 "pet",
 "dog",
 "cat",
 "collar",
 "leash",
 "toy",
 "bowl",
 "feeder",
 "fountain",
 "grooming",
 "hair remover",
 "brush",
 "bed",
 "carrier",
 "cleaning"
 ];

 const titleText = String(cjProduct.title).toLowerCase();

 const hasBlockedKeyword = blockedKeywords.some((keyword) =>
 titleText.includes(keyword)
 );

 const hasAllowedKeyword = allowedKeywords.some((keyword) =>
 titleText.includes(keyword)
 );

 if (hasBlockedKeyword) {
console.log("Blocked CJ product, skipping:", cjProduct.title);

if (
  productMemory &&
  typeof productMemory.addMemoryRecord === "function"
) {
  productMemory.addMemoryRecord({
    title: product.title,
    status: "rejected",
    reason: "blocked_keyword",
    score: product.score || 0,
    source: "cj_product",
    cjTitle: cjProduct.title || ""
  });
}

markCandidateTested(product.title);
continue; }

 if (!hasAllowedKeyword) {
  console.log("Non-pet / weak-match CJ product, skipping:", cjProduct.title);

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product.title,
      status: "rejected",
      reason: "weak_pet_match",
      score: product.score || 0,
      source: "cj_product",
      cjTitle: cjProduct.title || ""
    });
  }

  markCandidateTested(product.title);
  continue;
}

 if (Array.isArray(cjProduct.title)) {
 cjProduct.title = cjProduct.title.join(" ");
 }

 cjProduct.title = String(cjProduct.title)
 .replace(/[\[\]"]/g, "")
 .trim();

 if (cjProduct.title.length < 5) {
 console.log("Bad CJ title after cleaning, skipping");

 if (
 productMemory &&
 typeof productMemory.addMemoryRecord === "function"
 ) {
 productMemory.addMemoryRecord({
 title: product.title,
 status: "rejected",
 reason: "bad_cleaned_cj_title",
 score: product.score || 0,
 source: "cj_product",
 cjTitle: cjProduct.title || ""
 });
 }
 markCandidateTested(product.title);
 continue;
 }

 console.log("CJ match found:", cjProduct.title);
 console.log("CJ image:", cjProduct.images[0]);
 const match = isGoodCJMatch(product.title, cjProduct.title);

console.log("CJ match score:", match.score);

if (!match.good) {
  console.log("Rejected: weak CJ match");

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product.title,
      status: "rejected",
      reason: "weak_cj_match",
      score: match.score,
      source: "cj_match_filter",
      cjTitle: cjProduct.title || ""
    });
  }
 markCandidateTested(product.title);
  continue;
}
 const profitCheck = isProfitable(cjProduct);

console.log("Profit analysis:", profitCheck.analysis);

if (!profitCheck.pass) {
  console.log("Rejected: Low profit margin");

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product.title,
      status: "rejected",
      reason: "low_profit_margin",
      score: product.score || 0,
      source: "profit_engine",
      cjTitle: cjProduct.title || ""
    });
  }
  markCandidateTested(product.title);
  continue;
}

 const created = await createShopifyProduct(cjProduct);
 if (created) {
  saveCampaignDraft({
    title: cjProduct.title || product.title,
    image: cjProduct.image || (cjProduct.images && cjProduct.images[0]) || ""
  });
    saveCreativeDraft({
    title: cjProduct.title || product.title,
    image: cjProduct.image || (cjProduct.images && cjProduct.images[0]) || "",
    images: cjProduct.images || []
  });
}
 if (
 productMemory &&
 typeof productMemory.addMemoryRecord === "function"
 ) {
 productMemory.addMemoryRecord({
 title: product.title,
 status: created ? "shopify_created" : "rejected",
 reason: created ? "created_successfully" : "shopify_create_failed",
 score: product.score || 0,
 source: "shopify",
 cjTitle: cjProduct.title || "",
 shopifyCreated: Boolean(created)
 });
 }

 markCandidateTested(product.title);

 if (created) {
 break;
 }
} catch (loopErr) {
  console.log("Product loop error:");
  console.log(loopErr.message);

  if (
    productMemory &&
    typeof productMemory.addMemoryRecord === "function"
  ) {
    productMemory.addMemoryRecord({
      title: product?.title || "",
      status: "rejected",
      reason: loopErr.message || "product_loop_error",
      score: product?.score || 0,
      source: "loop_error"
    });
  }

 
  if (product?.title) {
    markCandidateTested(product.title);
  }
}
 }
 }

 // Run automation tasks
 await cjIntegration.syncOrders();
 await adsManager.optimize();
 await orderManager.process();
 await reports.weekly();
 await productResearch.scanTrends();
 } catch (loopErr) {
 console.error("ERROR inside main loop:", loopErr);
 }
 }, 60000);
 } catch (err) {
 console.error("FATAL STARTUP ERROR:", err);
 }
})();