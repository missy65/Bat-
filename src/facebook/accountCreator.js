// src/facebook/accountCreator.js

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { browserlessToken, mailVanishURL } = require('../config');
const { getRandomUserAgent, getRandomName } = require('../utils/spoof');
const { saveAccount } = require('../utils/logger');

async function createFacebookAccount() {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent('mobile'));
  await page.goto(mailVanishURL, { waitUntil: 'domcontentloaded' });

  const email = await page.evaluate(() => {
    return document.querySelector('#email')?.value || '';
  });

  const { firstName, lastName } = getRandomName();
  const password = `MightyBat@${Math.floor(Math.random() * 9999)}`;

  const fbPage = await browser.newPage();
  await fbPage.setUserAgent(getRandomUserAgent('mobile'));
  await fbPage.goto('https://m.facebook.com/reg/', { waitUntil: 'domcontentloaded' });

  // Fill form
  await fbPage.type('input[name="firstname"]', firstName);
  await fbPage.type('input[name="lastname"]', lastName);
  await fbPage.type('input[name="reg_email__"]', email);
  await fbPage.type('input[name="reg_passwd__"]', password);
  // Optional: Set birthday/gender here if required

  // Simulate submit
  // await fbPage.click('button[name="websubmit"]');
  // await fbPage.waitForTimeout(5000); // wait for email verify

  const account = {
    email,
    password,
    firstName,
    lastName,
  };

  saveAccount(account); // Save to data/accounts.json
  await browser.close();

  return account;
}

module.exports = createFacebookAccount;
