const axios = require("axios");
const cheerio = require("cheerio");

async function enrichProduct(product) {
try {
const query = encodeURIComponent(product.title);
const url = `https://www.amazon.com/s?k=${query}`;

const { data } = await axios.get(url, {
headers: {
"User-Agent": "Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const firstItem = $(".s-result-item").first();

const image =
firstItem.find("img").attr("src") || "";

const link =
"https://www.amazon.com" +
(firstItem.find("a").attr("href") || "");

return {
...product,
images: image ? [image] : [],
supplierLink: link || null,
supplierStatus: link ? "found" : "pending"
};

} catch (err) {
console.log("❌ Enrichment failed:", err.message);
return product;
}
}

module.exports = { enrichProduct };