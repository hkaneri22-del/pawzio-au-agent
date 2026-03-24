const axios = require("axios");
const cheerio = require("cheerio");

const fallbackImages = {
  "dog chew toy": "https://m.media-amazon.com/images/I/71wTQzJQeVL._AC_SL1500_.jpg",
  "slow feeder dog bowl": "https://m.media-amazon.com/images/I/71nQd1kM7CL._AC_SL1500_.jpg",
  "dog harness": "https://m.media-amazon.com/images/I/71mV8mF0d8L._AC_SL1500_.jpg",
  "cat tunnel toy": "https://m.media-amazon.com/images/I/71K8sKQw2jL._AC_SL1500_.jpg",
  "cat feeder bowl": "https://m.media-amazon.com/images/I/61sQ9m5d3xL._AC_SL1200_.jpg",
  "pet grooming brush": "https://m.media-amazon.com/images/I/71f4zXw8mLL._AC_SL1500_.jpg",
  "pet hair remover": "https://m.media-amazon.com/images/I/71hKQqv2qXL._AC_SL1500_.jpg",
  "dog travel bottle": "https://m.media-amazon.com/images/I/61bG4WkPj-L._AC_SL1500_.jpg",
  "pet cleaning wipes": "https://m.media-amazon.com/images/I/61h2C8mQFAL._AC_SL1200_.jpg",
  "cat scratching pad": "https://m.media-amazon.com/images/I/71n6HqR2cBL._AC_SL1500_.jpg",
  "cat toy ball": "https://m.media-amazon.com/images/I/61M0M6xQw-L._AC_SL1200_.jpg",
  "pet carrier bag": "https://m.media-amazon.com/images/I/71bK5UQm2TL._AC_SL1500_.jpg",
  "dog bed": "https://m.media-amazon.com/images/I/71n8mVYjTOL._AC_SL1500_.jpg",
  "pet water fountain": "https://m.media-amazon.com/images/I/61K8F6H6yQL._AC_SL1200_.jpg"
};

function getFallbackImage(product) {
  const keyword = String(product?.trendKeyword || product?.title || "")
    .trim()
    .toLowerCase();

  if (fallbackImages[keyword]) {
    return fallbackImages[keyword];
  }

  return "";
}

function getAmazonSearchLink(product) {
  const query = encodeURIComponent(
    String(product?.trendKeyword || product?.title || "").trim()
  );
  return query ? https://www.amazon.com/s?k=${query} : null;
}

async function enrichProduct(product) {
  try {
if (!product || !product.title) return product;

const query = encodeURIComponent(
String(product.trendKeyword || product.title).trim()
);

const url = `https://www.amazon.com/s?k=${query}`;

console.log("🔍 Enrichment search:", product.title);

const { data } = await axios.get(url, {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Accept-Language": "en-US,en;q=0.9"
},
timeout: 15000
});

const $ = cheerio.load(data);

    const firstImage =
      $("img.s-image").first().attr("src") ||
      $("img").first().attr("src") ||
      "";

    const firstLinkPath =
      $("a.a-link-normal.s-no-outline").first().attr("href") ||
      $("a.a-link-normal").first().attr("href") ||
      "";

    const supplierLink = firstLinkPath
      ? https://www.amazon.com${firstLinkPath}
      : getAmazonSearchLink(product);

    const finalImage =
      firstImage || getFallbackImage(product);

    const enriched = {
      ...product,
      images: finalImage ? [finalImage] : (product.images || []),
      supplierLink: supplierLink || product.supplierLink || null,
      supplierStatus: supplierLink ? "found" : (product.supplierStatus || "pending")
    };

    console.log("🖼 Enriched image:", enriched.images?.[0] || "none");
    console.log("🔗 Enriched supplier:", enriched.supplierLink || "none");

    return enriched;
  } catch (err) {
    console.log("❌ Enrichment failed:", err.message);

    const fallbackImage = getFallbackImage(product);
    const fallbackSupplierLink = getAmazonSearchLink(product);

    const fallbackProduct = {
      ...product,
      images: fallbackImage ? [fallbackImage] : (product.images || []),
      supplierLink: fallbackSupplierLink || product.supplierLink || null,
      supplierStatus: fallbackSupplierLink ? "fallback_search" : (product.supplierStatus || "pending")
    };

    console.log("🛟 Using fallback image:", fallbackProduct.images?.[0] || "none");
    console.log("🛟 Using fallback supplier:", fallbackProduct.supplierLink || "none");

    return fallbackProduct;
  }
}

module.exports = {
  enrichProduct
};