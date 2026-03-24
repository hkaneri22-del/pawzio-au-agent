const axios = require("axios");

async function generateAIImage(product) {
try {
const prompt = `A clean ecommerce product photo of ${product.title}, white background, high quality, realistic, studio lighting`;

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
}
}
);

return response.data.data[0].url;

} catch (err) {
console.log("❌ AI image failed:", err.message);
return null;
}
}

module.exports = { generateAIImage };