// src/config.js

require('dotenv').config();

module.exports = {
  browserlessToken: process.env.BROWSERLESS_API_KEY,
  mailVanishBase: process.env.MAIL_VANISH_URL || 'https://mail-vanish.com',
  defaultHeaders: {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Accept-Language': 'en-US,en;q=0.9',
  },
};
