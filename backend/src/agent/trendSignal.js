const googleTrends = require("google-trends-api");

async function getTrendScore(keyword) {
try {
const result = await googleTrends.interestOverTime({
keyword: keyword,
startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
});

const data = JSON.parse(result);
const timeline = data.default.timelineData || [];

if (timeline.length === 0) return 0;

const values = timeline.map(p => p.value[0]);
const avg = values.reduce((a, b) => a + b, 0) / values.length;

return avg / 100;
} catch (err) {
console.log("Trend check failed:", err.message);
return 0;
}
}

module.exports = { getTrendScore };
