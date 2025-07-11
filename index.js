const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3000;

// It's okay to hardcode for now, but in production use Railway env vars
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY || "2SexVzQVpMy2pWY2dfb7582c7a519bd6db9249c70a5fc7bc2";

app.get("/scrape-preview", async (req, res) => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

    const title = await page.title();
    await browser.close();

    res.send(`<title>${title}</title>`);
  } catch (error) {
    console.error("❌ Scraping Error:", error.message);
    res.status(500).send("Failed to load preview.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
