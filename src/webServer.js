// src/webServer.js
const express = require('express');
const bodyParser = require('body-parser');
const runBot = require('./facebook/controller');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Show form at homepage
app.get('/', (req, res) => {
  res.send(`
    <h2>🦇 Mighty Bat Bot - Web Trigger</h2>
    <form method="POST" action="/start">
      <input name="profileUrl" type="text" placeholder="Enter Facebook profile URL" style="width: 300px;" required />
      <br><br>
      <button type="submit">Start Bot</button>
    </form>
  `);
});

// Handle POST to trigger bot
app.post('/start', async (req, res) => {
  const profileUrl = req.body.profileUrl;

  if (!profileUrl || !profileUrl.startsWith('http')) {
    return res.status(400).send('❌ Invalid URL. Try again.');
  }

  try {
    logger.info(`🚀 Running bot on: ${profileUrl}`);
    await runBot(profileUrl);
    res.send(`✅ Bot completed for: ${profileUrl}`);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('❌ Bot crashed. Check Railway logs.');
  }
});

// Start server
app.listen(PORT, () => {
  logger.info(`🌐 Server live at http://localhost:${PORT}`);
});
