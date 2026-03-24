const axios = require("axios");
const cheerio = require("cheerio");
const { generateAIImage } = require("./imageGenerator");


function getAmazonSearchLink(product) {
try {
const query = encodeURIComponent(
String(product?.trendKeyword || product?.title || "").trim()
);

return query
? `https://www.amazon.com/s?k=${query}`
: null;

} catch (err) {
console.log("❌ Amazon link error:", err.message);
return null;
}
}

// 🔁 Fallback images (jab scraping fail ho)
const fallbackImages = {
"slow feeder dog bowl": "https://m.media-amazon.com/images/I/71nQd1kM7CL._AC_SL1500_.jpg",
"dog harness": "https://m.media-amazon.com/images/I/71mV8mF0d8L._AC_SL1500_.jpg",
"cat tunnel toy": "https://m.media-amazon.com/images/I/71K8sKQw2JL._AC_SL1500_.jpg",
"cat feeder bowl": "https://m.media-amazon.com/images/I/61sQ9m5d3XL._AC_SL1200_.jpg",
"pet grooming brush": "https://m.media-amazon.com/images/I/71f4zXw8mLL._AC_SL1500_.jpg",
"pet hair remover": "https://m.media-amazon.com/images/I/71hKQvq2qXL._AC_SL1500_.jpg",
"dog travel bottle": "https://m.media-amazon.com/images/I/61bG4WkPj-L._AC_SL1500_.jpg",
"pet cleaning wipes": "https://m.media-amazon.com/images/I/61h2C8mQFAL._AC_SL1200_.jpg",
"cat scratching pad": "https://m.media-amazon.com/images/I/71n6HqR2cBL._AC_SL1500_.jpg",
"dog bed": "https://m.media-amazon.com/images/I/71n8mNVjyTOL._AC_SL1500_.jpg"
};

// 🔁 fallback image finder
function getFallbackImage(product) {
const keyword = String(product?.trendKeyword || product?.title || "")
.toLowerCase()
.trim();

return fallbackImages[keyword] || "";
}

// 🔗 Amazon search link generator
function getAmazonSearchLink(product) {
const query = encodeURIComponent(
String(product?.trendKeyword || product?.title || "").trim()
);

return query ? `https://www.amazon.com/s?k=${query}` : null;
}

// 🧠 MAIN ENRICH FUNCTION
async function enrichProduct(product) {
try {
if (!product || !product.title) return product;

const query = encodeURIComponent(
String(product.trendKeyword || product.title).trim()
);

const url = `https://www.amazon.com/s?k=${query}`;

console.log("🔎 Enrichment search:", product.title);

const { data } = await axios.get(url, {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Accept-Language": "en-US,en;q=0.9"
},
timeout: 10000
});

const $ = cheerio.load(data);

const firstItem = $(".s-result-item").first();

const image =
firstItem.find("img").attr("src") || getFallbackImage(product);

const link =
"https://www.amazon.com" +
(firstItem.find("a").attr("href") || "");

return {
...product,
images: image ? [image] : [],
supplierLink: link || getAmazonSearchLink(product),
supplierStatus: link ? "found" : "fallback"
};

} catch (err) {
    console.log("❌ Enrichment failed:", err.message);

    let image =
      product.images?.length
        ? product.images[0]
        : getFallbackImage(product);

    if (!image) {
      image = await generateAIImage(product);
    }

    return {
      ...product,
      images: image ? [image] : [],
      supplierLink: getAmazonSearchLink(product),
      supplierStatus: "fallback"
    };
  }
}

module.exports = { enrichProduct };
