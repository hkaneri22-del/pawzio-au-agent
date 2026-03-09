const fs = require("fs");

console.log("🟢 Ads Manager module loaded (Approval Mode)");

async function optimize(campaignData) {

    console.log("🟡 AI prepared a campaign for approval...");

    const approvalData = {
        timestamp: new Date().toISOString(),
        campaign: campaignData || {
            name: "AI Test Campaign",
            budget: 20,
            objective: "OUTCOME_SALES",
        },
        status: "PENDING_APPROVAL"
    };

    fs.writeFileSync(
        "pending_campaign.json",
        JSON.stringify(approvalData, null, 2)
    );

    console.log("📄 Campaign saved to pending_campaign.json");
    console.log("⛔ Waiting for manual approval before publishing...");
}

module.exports = {
    optimize
};
const axios = require("axios");

async function createDraftFromPending() {
  if (!fs.existsSync("pending_campaign.json")) {
    console.log("No pending campaign.");
    return;
  }

  const data = JSON.parse(
    fs.readFileSync("pending_campaign.json", "utf8")
  );

  const token = process.env.META_ACCESS_TOKEN;
  const adAccount = process.env.META_AD_ACCOUNT_ID;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/act_${adAccount}/campaigns`,
      {
        name: data.campaign.name,
        objective: "OUTCOME_SALES",
        status: "PAUSED",
        special_ad_categories: [],
        is_adset_budget_sharing_enabled: false,
      },
      {
        params: { access_token: token }
      }
    );

    console.log("Draft Campaign Created:", response.data.id);
const campaignId = response.data.id;

const adsetResponse = await axios.post(
`https://graph.facebook.com/v19.0/act_${adAccount}/adsets`,
{
name: "AI Adset - Purchase Optimized",
campaign_id: campaignId,
daily_budget: 2000,
billing_event: "IMPRESSIONS",
optimization_goal: "CONVERSIONS",
promoted_object: {
pixel_id: "1096315945818287",
custom_event_type: "PURCHASE"
},
targeting: {
geo_locations: {
countries: ["AU"]
},
age_min: 21,
age_max: 55
},
status: "PAUSED",
},
{ params: { access_token: token } }
);
console.log("Adset Created:", adsetResponse.data.id);


   // fs.unlinkSync("pending_campaign.json");

  } catch (error) {
    console.error("Meta API Error:", error.response?.data || error.message);
  }
}

module.exports.createDraftFromPending = createDraftFromPending;