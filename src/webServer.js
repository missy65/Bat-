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

app.post('/start', async (req, res) => {
  const { profileUrl } = req.body;
  if (!profileUrl) return res.status(400).send('❌ Missing profile URL');

  try {
    logger.info(`Target: ${profileUrl}`);
    await runBot(profileUrl);
    res.send(`✅ Done! Bot completed for ${profileUrl}`);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('❌ Bot failed.');
  }
});

app.listen(PORT, () => {
  logger.success(`🌐 Server ready at http://localhost:${PORT}`);
});
