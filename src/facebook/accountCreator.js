// src/facebook/accountCreator.js

const puppeteer = require('puppeteer-core');
const { browserlessToken, mailVanishURL } = require('../config');
const { getRandomUserAgent } = require('../utils/spoof');
const { saveAccount } = require('../utils/logger');

/**
 * Create a Facebook account using scraped friend data
 * @param {Object} friendData - Scraped profile info from friends list
 */
async function createFacebookAccount(friendData) {
  const { firstName, lastName, profilePicture, coverPhoto } = friendData;
  const password = `MightyBat@${Math.floor(1000 + Math.random() * 8999)}`;

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent('mobile'));

  await page.goto(mailVanishURL, { waitUntil: 'domcontentloaded' });

  const email = await page.evaluate(() => {
    return document.querySelector('#email')?.value || '';
  });

  const fbPage = await browser.newPage();
  await fbPage.setUserAgent(getRandomUserAgent('mobile'));

  await fbPage.goto('https://m.facebook.com/reg/', { waitUntil: 'domcontentloaded' });

  // Fill in real scraped data
  await fbPage.type('input[name="firstname"]', firstName);
  await fbPage.type('input[name="lastname"]', lastName);
  await fbPage.type('input[name="reg_email__"]', email);
  await fbPage.type('input[name="reg_passwd__"]', password);

  // You could also handle birthday, gender, or next-step page waits here

  // Optional: Wait for manual CAPTCHA/email step if needed
  // await fbPage.click('button[name="websubmit"]');

  const newAccount = {
    email,
    password,
    firstName,
    lastName,
    profilePicture,
    coverPhoto,
  };

  saveAccount(newAccount);
  await browser.close();

  return newAccount;
}

module.exports = createFacebookAccount;
