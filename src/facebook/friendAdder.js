// src/facebook/friendAdder.js

const puppeteer = require('puppeteer-core');
const { browserlessToken } = require('../config');
const { getRandomUserAgent } = require('../utils/spoof');
const logger = require('../utils/logger');
const fs = require('fs');

function loadScrapedFriends(profileId) {
  const data = JSON.parse(fs.readFileSync('./data/profiles.json', 'utf-8'));
  return data[profileId]?.friends || [];
}

async function sendFriendRequests(account, profileId) {
  logger.info(`🔗 Logging into account: ${account.email}`);

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent('mobile'));

  // Log in
  await page.goto('https://m.facebook.com/login', { waitUntil: 'domcontentloaded' });
  await page.type('#m_login_email', account.email);
  await page.type('#m_login_password', account.password);
  await page.click('button[name="login"]');
  await page.waitForNavigation();

  const friends = loadScrapedFriends(profileId);
  logger.info(`👥 Found ${friends.length} friends to add for profile: ${profileId}`);

  for (const friendUrl of friends) {
    try {
      await page.goto(friendUrl, { waitUntil: 'domcontentloaded' });

      const friendButton = await page.$('a[href*="add_friend"]');
      if (friendButton) {
        await friendButton.click();
        logger.success(`✅ Friend request sent to: ${friendUrl}`);
      } else {
        logger.warn(`⚠️  No Add Friend button on: ${friendUrl}`);
      }

      await page.waitForTimeout(2000 + Math.random() * 2000); // Smart delay
    } catch (err) {
      logger.error(`❌ Failed to send request to ${friendUrl}: ${err.message}`);
    }
  }

  await browser.close();
  logger.success(`🎯 Finished friend requests for ${account.email}`);
}

module.exports = sendFriendRequests;
