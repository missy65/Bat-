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
    console.error("❌ Scraping Error:", error);  // Show full error
    res.status(500).send(`Failed to load preview: ${error.message}`);
  }
});
