// src/facebook/cloner.js

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { browserlessToken } = require('../config');
const { getRandomUserAgent } = require('../utils/spoof');
const { loadProfileData } = require('../utils/logger');

async function cloneProfile(account, profileId) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent('mobile'));

  const profile = loadProfileData(profileId); // Load from data/profiles.json

  // Login to FB account
  await page.goto('https://m.facebook.com/login', { waitUntil: 'domcontentloaded' });
  await page.type('#m_login_email', account.email);
  await page.type('#m_login_password', account.password);
  await page.click('button[name="login"]');
  await page.waitForNavigation();

  // Go to profile editing page
  await page.goto('https://m.facebook.com/profile/edit', { waitUntil: 'domcontentloaded' });

  // Fill bio fields
  if (profile.about) {
    await page.type('textarea[name="bio"]', profile.about.slice(0, 100));
  }

  // TODO: Upload profile photo & cover photo if available
  // Puppeteer cannot upload files remotely via browserless, so we skip this unless file uploads are handled by a separate uploader or public URLs

  await page.waitForTimeout(3000);
  await browser.close();

  return true;
}

module.exports = cloneProfile;
