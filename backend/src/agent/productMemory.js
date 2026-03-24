const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(__dirname, "testedProducts.json");

function readMemory() {
try {
if (!fs.existsSync(MEMORY_PATH)) {
return [];
}

const raw = fs.readFileSync(MEMORY_PATH, "utf8");
const parsed = JSON.parse(raw);
return Array.isArray(parsed) ? parsed : [];
} catch (err) {
console.log("❌ Failed to read product memory");
console.log(err.message);
return [];
}
}

function writeMemory(data) {
try {
fs.writeFileSync(MEMORY_PATH, JSON.stringify(data, null, 2), "utf8");
return true;
} catch (err) {
console.log("❌ Failed to write product memory");
console.log(err.message);
return false;
}
}

function normalizeTitle(title) {
return String(title || "").trim().toLowerCase();
}

function hasMemory(title) {
const memory = readMemory();
const normalized = normalizeTitle(title);
return memory.some((item) => normalizeTitle(item.title) === normalized);
}

function getMemoryRecord(title) {
const memory = readMemory();
const normalized = normalizeTitle(title);
return memory.find((item) => normalizeTitle(item.title) === normalized) || null;
}

function addMemoryRecord(record) {
const memory = readMemory();
const normalized = normalizeTitle(record.title);

const existingIndex = memory.findIndex(
(item) => normalizeTitle(item.title) === normalized
);

const newRecord = {
title: record.title || "",
status: record.status || "unknown",
reason: record.reason || "",
score: Number(record.score || 0),
source: record.source || "",
cjTitle: record.cjTitle || "",
shopifyCreated: Boolean(record.shopifyCreated),
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
};

if (existingIndex >= 0) {
memory[existingIndex] = {
...memory[existingIndex],
...newRecord,
updatedAt: new Date().toISOString()
};
} else {
memory.push(newRecord);
}

writeMemory(memory);
}

function shouldSkipProduct(title) {
  if (!title) return false;

  const records = readMemory(); // existing function

  const normalizedTitle = String(title).trim().toLowerCase();

  const match = records.find(
    (r) => String(r.title).trim().toLowerCase() === normalizedTitle
  );

  if (!match) return false;

 // TEMP TEST MODE
    return false;
  }

const record = getMemoryRecord(title);

if (!record) return false;

const permanentRejectReasons = [
"blocked_keyword",
"weak_pet_match",
"invalid_title",
"bad_cleaned_cj_title"
];

if (record.status === "shopify_created") return true;
if (permanentRejectReasons.includes(record.reason)) return true;

return false;
}

function getMemoryStatsForTitle(title) {
const memory = readMemory();
const lowerTitle = String(title || "").toLowerCase();

const successKeywords = [
"hair",
"remover",
"brush",
"grooming",
"fountain",
"collar",
"toy",
"cleaning",
"fur",
"portable"
];

const weakKeywords = [
"wooden",
"coop",
"cage",
"furniture",
"sofa",
"cabinet",
"chair",
"table",
"decor"
];

let successfulPatternHits = 0;
let rejectedPatternHits = 0;
let blockedPatternHits = 0;

for (const item of memory) {
const memTitle = String(item.title || "").toLowerCase();

for (const kw of successKeywords) {
if (
lowerTitle.includes(kw) &&
memTitle.includes(kw) &&
item.status === "shopify_created"
) {
successfulPatternHits += 1;
}
}

for (const kw of weakKeywords) {
if (
lowerTitle.includes(kw) &&
memTitle.includes(kw) &&
item.status === "rejected"
) {
rejectedPatternHits += 1;
}
}

if (
item.reason === "blocked_keyword" &&
weakKeywords.some((kw) => lowerTitle.includes(kw) && memTitle.includes(kw))
) {
blockedPatternHits += 1;
}
}

return {
successfulPatternHits,
rejectedPatternHits,
blockedPatternHits
};
}

function getMemoryScoreAdjustment(title) {
const stats = getMemoryStatsForTitle(title);

let boost = 0;
let penalty = 0;

boost += stats.successfulPatternHits * 1.5;
penalty += stats.rejectedPatternHits * 1.5;
penalty += stats.blockedPatternHits * 2;

return {
...stats,
boost,
penalty,
adjustment: boost - penalty
};
}

module.exports = {
readMemory,
writeMemory,
normalizeTitle,
hasMemory,
getMemoryRecord,
addMemoryRecord,
shouldSkipProduct,
getMemoryStatsForTitle,
getMemoryScoreAdjustment
};