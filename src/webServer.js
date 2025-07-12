const express = require('express');
const bodyParser = require('body-parser');
const runBot = require('./facebook/controller');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h2>🦇 Mighty Bat Bot</h2>
    <form method="POST" action="/run">
      <label>Facebook Profile URL:</label><br/>
      <input type="text" name="profileUrl" style="width:300px;" required /><br/><br/>
      <button type="submit">Launch Bot</button>
    </form>
  `);
});

app.post('/run', async (req, res) => {
  const { profileUrl } = req.body;
  logger.info(`🧠 Received: ${profileUrl}`);
  if (!profileUrl.includes('facebook.com')) return res.send('❌ Invalid URL');

  try {
    await runBot(profileUrl);
    res.send('✅ Bot run completed!');
  } catch (e) {
    logger.error('Bot crashed:', e.message);
    res.status(500).send('❌ Bot crashed.');
  }
});

app.listen(PORT, () => {
  logger.success(`🟢 Server running on port ${PORT}`);
});
