// src/webServer.js
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`<h1>🦇 Mighty Bat Bot is Alive!</h1><p>Web interface is working.</p>`);
});

app.get('/scrape-preview', (req, res) => {
  res.json({ status: '✅ Scraping preview is active' });
});

app.listen(PORT, () => {
  logger.info(`🌐 Web server running on http://localhost:${PORT}`);
});
