const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

app.get("/", (req, res) => {
  res.send("✅ Server is live. Go to /scrape-preview?url=https://example.com");
});

app.get("/scrape-preview", async (req, res) => {
  const targetURL = req.query.url || "https://example.com";

  const query = {
    query: `
      query {
        goto(url: "${targetURL}") {
          document {
            title
          }
        }
      }
    `
  };

  try {
    const response = await axios.post(
      `https://chrome.browserless.io/browserql?token=${BROWSERLESS_API_KEY}`,
      query,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    const title = response.data?.data?.goto?.document?.title;
    res.send(`<h1>🔍 Page Title:</h1><p>${title}</p>`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).send(`Failed to scrape: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
