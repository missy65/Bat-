// src/facebook/cloner.js

const puppeteer = require('puppeteer-core');
const { browserlessToken } = require('../config');
const { getRandomUserAgent } = require('../utils/spoof');
const { loadProfileData } = require('../utils/logger');

async function cloneProfile(account, profileId) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent('mobile'));

  const profile = loadProfileData(profileId); // Loads from data/profiles.json

  // Login to FB
  await page.goto('https://m.facebook.com/login', { waitUntil: 'domcontentloaded' });
  await page.type('#m_login_email', account.email);
  await page.type('#m_login_password', account.password);
  await page.click('button[name="login"]');
  await page.waitForNavigation();

  // Navigate to profile editing page
  await page.goto('https://m.facebook.com/profile/edit', { waitUntil: 'domcontentloaded' });

  // Build realistic bio
  const bioText = `📍 From ${profile.currentCity || 'an unknown place'} • 🎓 Studied at ${profile.education || 'an unknown school'} • 💼 Works at ${profile.work || 'unknown job'}`;
  await page.type('textarea[name="bio"]', bioText.slice(0, 100));

  // Optional: Profile & cover photo uploads (future enhancement)

  await page.waitForTimeout(3000);
  await browser.close();

  return true;
}

module.exports = cloneProfile;
