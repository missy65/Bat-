// src/webServer.js

const express = require('express');
const bodyParser = require('body-parser');
const runBot = require('./facebook/controller');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Home page with form
app.get('/', (req, res) => {
  res.send(`
    <h1>Mighty Bat Bot 🦇</h1>
    <form method="POST" action="/run">
      <label>Facebook Profile URL:</label><br>
      <input type="text" name="profileUrl" style="width:300px;" required />
      <br><br>
      <button type="submit">🧠 Launch Bot</button>
    </form>
  `);
});

// Handle bot trigger
app.post('/run', async (req, res) => {
  const { profileUrl } = req.body;

  if (!profileUrl || !profileUrl.includes('facebook.com')) {
    return res.send('❌ Invalid Facebook URL.');
  }

  logger.info(`🧠 Received profile: ${profileUrl}`);
  try {
    await runBot(profileUrl);
    res.send('✅ Bot completed successfully. Check logs for details.');
  } catch (err) {
    logger.error('❌ Bot failed:', err.message);
    res.status(500).send('❌ Error running the bot.');
  }
});

app.listen(PORT, () => {
  logger.success(`🌐 Web server listening on port ${PORT}`);
});
