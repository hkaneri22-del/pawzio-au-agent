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

module.exports = {
readMemory,
writeMemory,
hasMemory,
getMemoryRecord,
addMemoryRecord
};