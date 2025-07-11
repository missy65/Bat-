const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

// Root route: shows instructions
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Browserless Scraper Ready</h2>
    <p>Test it at: <a href="/scrape-preview">/scrape-preview</a></p>
    <p>Or scrape another site: <code>/scrape-preview?url=https://your-site.com</code></p>
  `);
});

// Scrape preview route
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
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
