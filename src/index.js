// src/index.js

const runBot = require('./facebook/controller');
const logger = require('./utils/logger');
const readline = require('readline');

// Prompt user for target profile
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('🧠 Enter the Facebook profile URL to target: ', async (profileUrl) => {
  rl.close();

  try {
    logger.info('🚀 Launching Mighty Bat Bot 🦇...');
    await runBot(profileUrl);
    logger.success('✅ All missions completed!');
  } catch (error) {
    logger.error('❌ Bot crashed:', error.message);
    process.exit(1);
  }
});
