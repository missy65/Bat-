// src/index.js

const express = require('express');
const logger = require('./utils/logger');
const { runForTargetProfile } = require('./facebook/controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🦇 Mighty Bat Bot is ready. Use /run?url=https://facebook.com/...');
});

app.get('/run', async (req, res) => {
  const url = req.query.url;

  if (!url || !url.includes('facebook.com')) {
    return res.status(400).send('❌ Invalid or missing Facebook URL');
  }

  try {
    logger.info(`🟢 Starting bot for target: ${url}`);
    await runForTargetProfile(url);
    res.send(`✅ Mission complete for: ${url}`);
  } catch (error) {
    logger.error('❌ Mission failed:', error.message);
    res.status(500).send(`❌ Failed to run bot: ${error.message}`);
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
