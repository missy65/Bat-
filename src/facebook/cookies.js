// src/facebook/cookies.js

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const cookiesDir = path.join(__dirname, '../../data/cookies');

// Ensure cookies directory exists
if (!fs.existsSync(cookiesDir)) {
  fs.mkdirSync(cookiesDir, { recursive: true });
}

function getCookiePath(email) {
  const safeEmail = email.replace(/[@.]/g, '_');
  return path.join(cookiesDir, `${safeEmail}.json`);
}

// Save cookies to file after login
async function saveCookies(page, email) {
  const cookies = await page.cookies();
  const filePath = getCookiePath(email);
  fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));
  logger.success(`🍪 Saved cookies for: ${email}`);
}

// Load cookies from file before login
async function loadCookies(page, email) {
  const filePath = getCookiePath(email);
  if (fs.existsSync(filePath)) {
    const cookies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await page.setCookie(...cookies);
    logger.info(`🍪 Loaded cookies for: ${email}`);
    return true;
  } else {
    logger.warn(`🚫 No cookies found for: ${email}`);
    return false;
  }
}

module.exports = {
  saveCookies,
  loadCookies,
};
