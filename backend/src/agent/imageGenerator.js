const axios = require("axios");

async function generateAIImage(product) {
try {
if (!product || !product.title) return null;

const prompt = `A clean ecommerce product photo of ${product.title}, white background, realistic, premium lighting, high quality`;

console.log("🎨 Generating AI image for:", product.title);

const response = await axios.post(
"https://api.openai.com/v1/images/generations",
{
model: "gpt-image-1",
prompt: prompt,
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

console.log("🖼 AI image generated:", imageUrl || "none");

return imageUrl;

} catch (err) {
console.log("❌ AI image failed:", err.response?.data || err.message);
return null;
}
}

module.exports = { generateAIImage };