const fs = require("fs");
const path = require("path");

const CANDIDATES_PATH = path.join(__dirname, "viralCandidates.json");

function readCandidates() {
  try {
    if (!fs.existsSync(CANDIDATES_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(CANDIDATES_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.log("❌ Failed to read viral candidates");
    console.log(err.message);
    return [];
  }
}

function writeCandidates(candidates) {
  try {
    fs.writeFileSync(
      CANDIDATES_PATH,
      JSON.stringify(candidates, null, 2),
      "utf8"
    );
    return true;
  } catch (err) {
    console.log("❌ Failed to write viral candidates");
    console.log(err.message);
    return false;
  }
}

function getNextViralCandidates(limit = 3) {
  const candidates = readCandidates();

  const pending = candidates
    .filter((c) => !c.tested)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0));

  return pending.slice(0, limit);
}

function markCandidateTested(title) {
  const candidates = readCandidates();

  const updated = candidates.map((c) => {
    if (String(c.title || "").trim().toLowerCase() === String(title || "").trim().toLowerCase()) {
      return {
        ...c,
        tested: true,
        testedAt: new Date().toISOString()
      };
    }
    return c;
  });

  writeCandidates(updated);
}

module.exports = {
  readCandidates,
  writeCandidates,
  getNextViralCandidates,
  markCandidateTested
};