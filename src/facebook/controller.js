// src/facebook/controller.js

const scrapeProfile = require('./scraper');
const createAccount = require('./accountCreator');
const cloneProfile = require('./cloner');
const sendFriendRequests = require('./friendAdder');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { wait } = require('../utils/delay');

const DATA_DIR = path.resolve(__dirname, '../../data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

async function runForTargetProfile(profileUrl) {
  logger.info(`🕵️ Starting full mission for: ${profileUrl}`);

  // STEP 1: Scrape the target profile & friends
  const scrapedData = await scrapeProfile(profileUrl);
  const profileId = scrapedData.id || scrapedData.username || Date.now().toString();

  // Save scraped profile
  const profilesPath = path.join(DATA_DIR, 'profiles.json');
  const allProfiles = fs.existsSync(profilesPath)
    ? JSON.parse(fs.readFileSync(profilesPath))
    : {};
  allProfiles[profileId] = scrapedData;
  fs.writeFileSync(profilesPath, JSON.stringify(allProfiles, null, 2));
  logger.success(`📦 Profile saved: ${profileId}`);

  // STEP 2–4: For each scraped friend, create + clone + send request
  const accounts = [];

  for (const friendUrl of scrapedData.friends) {
    logger.info(`👤 Creating account for friend: ${friendUrl}`);

    const account = await createAccount(); // Uses Mail-Vanish
    await cloneProfile(account, scrapedData); // Clones main profile info
    await sendFriendRequests(account, profileId); // Sends friend requests

    accounts.push(account);
    await wait(3000, 7000); // Wait between each loop
  }

  // Save created accounts
  const prevAccounts = fs.existsSync(ACCOUNTS_FILE)
    ? JSON.parse(fs.readFileSync(ACCOUNTS_FILE))
    : [];
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify([...prevAccounts, ...accounts], null, 2));

  logger.success(`🎯 Completed all missions for: ${profileUrl}`);
}

module.exports = async function runBot() {
  const TARGETS = [
    'https://www.facebook.com/ronnie.ezell.510125/', // Replace or loop more
  ];

  for (const url of TARGETS) {
    await runForTargetProfile(url);
    await wait(5000, 10000); // Cool down before next
  }
};
