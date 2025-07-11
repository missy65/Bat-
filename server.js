require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3000;
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

if (!BROWSERLESS_API_KEY) {
  throw new Error("Missing BROWSERLESS_API_KEY in environment variables.");
}

// Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Server is running. Go to /scrape-preview to test scraping.");
});

// Preview scrape route
app.get("/scrape-preview", async (req, res) => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

    const title = await page.title();
    await browser.close();

    res.send(`🔍 Page Title: ${title}`);
  } catch (error) {
    console.error("❌ Scraping error:", error);
    res.status(500).send(`Failed to scrape: ${error.message}`);
  }
});

// Optional health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
