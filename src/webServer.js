// src/webServer.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const runBot = require('./facebook/controller');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/start-mission', async (req, res) => {
  const { profileUrl } = req.body;
  logger.info(`🧠 Web Mission Target: ${profileUrl}`);
  try {
    await runBot(profileUrl);
    res.send(`<h2>✅ Mission complete for: ${profileUrl}</h2>`);
  } catch (error) {
    res.status(500).send(`<h2>❌ Error: ${error.message}</h2>`);
  }
});

module.exports = function startWebServer() {
  app.listen(PORT, () => {
    logger.success(`🌐 Web server ready on port ${PORT}`);
  });
};
