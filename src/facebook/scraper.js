// src/facebook/scraper.js

const puppeteer = require('puppeteer-core');
const { browserlessToken } = require('../config');
const { getRandomUserAgent } = require('../utils/spoof');
const logger = require('../utils/logger');

async function scrapeFacebookProfile(url) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  logger.info(`🕵️ Scraping profile: ${url}`);

  const data = await page.evaluate(() => {
    const getText = selector => document.querySelector(selector)?.innerText || '';
    const getImg = selector => document.querySelector(selector)?.src || '';

    return {
      name: getText('h1'),
      profilePicture: getImg('image[id^="profile_pic"]') || '',
      coverPhoto: getImg('image[style*="cover_photo"]') || '',
    };
  });

  logger.info('📸 Scraped basic profile info:', data);

  // TODO: Click "See more about" and collect more details (if visible)
  // TODO: Scrape visible friends list

  await browser.close();
  return data;
}

module.exports = scrapeFacebookProfile;
