const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

app.get("/scrape-preview", async (req, res) => {
  try {
    const url = req.query.url || "https://example.com";

    const response = await axios.post(
      `https://production-sfo.browserless.io/content?token=${BROWSERLESS_API_KEY}`,
      { url },
      {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json"
        }
      }
    );

    const html = response.data;
    const match = html.match(/<title>(.*?)<\/title>/i);
    const title = match ? match[1] : "No title found";

    res.send(`<h1>🔍 Page Title: ${title}</h1>`);
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    res.status(500).send(`❌ Scraping failed: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running: http://localhost:${PORT}`);
});
