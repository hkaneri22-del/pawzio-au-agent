console.log("🤖 AI Agent index.js loaded");

require("dotenv").config();

(async () => {
  try {
    console.log("🚀 AI Agent starting up...");

    // Load modules
    const productScanner = require("./productScanner");
    const shopifySync = require("./shopifySync");
    const cjIntegration = require("./cjIntegration");
    const adsManager = require("./adsManager");
    const orderManager = require("./orderManager");
    const reports = require("./reports");
    const productResearch = require("./productResearch");
    const scoreProduct = require("./productScoring");

    console.log("✅ All modules loaded successfully");

    // Main loop runs every 60 seconds
    setInterval(async () => {

      try {

        console.log("❤️ Heartbeat – running AI tasks...");

        // 🔎 Research products
        const researched = await productScanner.scan();

        if (researched && researched.length) {

          console.log("📊 Scoring pet products...");

          const ranked = researched
            .map(p => {
              p.score = scoreProduct(p);
              return p;
            })
            .sort((a, b) => b.score - a.score);

          console.log("🐾 Top Pet Products:");
          console.log(ranked.slice(0, 3));

          // 🛍 Create Top 3 Products in Shopify
          for (let product of ranked.slice(0, 3)) {
            await createShopifyProduct(product);
          }
        }

        // 🔄 Sync + Operations
        await shopifySync.sync();
        await cjIntegration.syncOrders();
        await adsManager.optimize();
        await orderManager.process();
        await reports.weekly();
        await productResearch.scanTrends();

      } catch (loopErr) {
        console.error("❌ ERROR inside main loop:", loopErr);
      }

    }, 60000);

  } catch (err) {
    console.error("❌ FATAL STARTUP ERROR:", err);
  }

})();
