const express = require('express');
const { runForTargetProfile } = require('./facebook/controller');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<h2>🦇 Mighty Bat Bot is alive</h2><p>Use <code>/run?url=FACEBOOK_PROFILE_URL</code> to begin a mission.</p>`);
});

app.get('/run', async (req, res) => {
  const profileUrl = req.query.url;
  if (!profileUrl) {
    return res.status(400).send('❌ No URL provided. Add ?url=https://facebook.com/... to the request.');
  }

  logger.info(`🧠 Received mission: ${profileUrl}`);

  try {
    await runForTargetProfile(profileUrl);
    res.send(`✅ Mission completed for ${profileUrl}`);
  } catch (err) {
    logger.error(`❌ Mission failed: ${err.message}`);
    res.status(500).send(`❌ Failed: ${err.message}`);
  }
});

app.listen(PORT, () => {
  logger.success(`🦇 Server ready! Enter: /run?url=https://facebook.com/...`);
});
