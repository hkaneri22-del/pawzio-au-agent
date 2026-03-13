const axios = require("axios");

async function getTrendScore(keyword) {
 try {
 const url = `https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US`;

 const response = await axios.get(url, {
 timeout: 5000
 });

 if (!response.data) {
 return 0;
 }

 const text = JSON.stringify(response.data).toLowerCase();

 if (text.includes(keyword.toLowerCase())) {
 return 1;
 }

 return 0;

 } catch (err) {

 console.log(" Trend signal fallback:", err.message);

 return 0;
 }
}

module.exports = {
 getTrendScore
};