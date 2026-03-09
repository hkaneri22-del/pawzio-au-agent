require("dotenv").config();
const adsManager = require("./src/agent/adsManager");

adsManager.optimize({
  name: "AI Test Campaign",
  budget: 20
});