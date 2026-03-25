const axios = require("axios");

async function generateAIImage(product) {
try {
if (!product || !product.title) {
console.log("❌ AI image skipped: invalid product");
return null;
}

if (!process.env.OPENAI_API_KEY) {
console.log("❌ AI image skipped: OPENAI_API_KEY missing");
return null;
}

const prompt = `A clean ecommerce product photo of ${product.title}, white background, realistic, premium lighting, high quality`;

console.log("🎨 Generating AI image for:", product.title);

const response = await axios.post(
"https://api.openai.com/v1/images/generations",
{
model: "gpt-image-1",
prompt,
size: "1024x1024"
},
{
headers: {
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json"
},
timeout: 60000
}
);

const imageUrl = response?.data?.data?.[0]?.url || null;

if (!imageUrl) {
console.log("❌ AI image response had no URL");
console.log("AI image raw response:", JSON.stringify(response?.data || {}, null, 2));
return null;
}

console.log("🖼 AI image generated:", imageUrl);

return imageUrl;
} catch (err) {
console.log("❌ AI image failed:", err.response?.status || err.message);
if (err.response?.data) {
console.log("AI image error response:", JSON.stringify(err.response.data, null, 2));
}
return null;
}
}

module.exports = { generateAIImage };
