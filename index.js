const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your environment variable in production
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY || "2SexVzQVpMy2pWY2dfb7582c7a519bd6db9249c70a5fc7bc2";

app.get("/", (req, res) => {
  res.send("✅ Server is running. Go to /scrape-preview to test scraping.");
});

app.get("/scrape-preview", async (req, res) => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`
    });

    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

    const title = await page.title();
    await browser.close();

    res.send(`<title>${title}</title>`);
  } catch (error) {
    console.error("❌ Scraping Error:", error);
    res.status(500).send(`Failed to load preview: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
