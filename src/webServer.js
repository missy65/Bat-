// src/webServer.js

const express = require('express');
const runBot = require('./facebook/controller');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('🦇 Mighty Bat Bot is ready. Use /run?profile=https://facebook.com/... to trigger.');
});

app.get('/run', async (req, res) => {
  const profileUrl = req.query.profile;
  if (!profileUrl) return res.status(400).send('Missing ?profile=... parameter');

  try {
    logger.info(`🔗 Running bot for: ${profileUrl}`);
    await runBot(profileUrl);
    res.send('✅ Bot finished scraping & cloning.');
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('❌ Failed to complete bot task.');
  }
});

app.listen(PORT, () => {
  logger.success(`🌐 Web server running on port ${PORT}`);
});
