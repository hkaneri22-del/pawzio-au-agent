console.log("📣 AdProofEngine module loaded");

function checkMetaAdProof(product) {
const title = String(product?.title || "").toLowerCase();

const proofKeywords = [
"dog",
"cat",
"pet",
"collar",
"brush",
"bowl",
"harness",
"fountain",
"toy"
];

const matched = proofKeywords.filter((word) => title.includes(word));

return {
found: matched.length > 0,
proofScore: matched.length,
source: "Meta Ad Library",
notes: matched.length
? `Keyword proof matched: ${matched.join(", ")}`
: "No strong Meta keyword proof found"
};
}

module.exports = {
checkMetaAdProof
};