const runBot = require('./facebook/controller');   // Orchestrates all bot operations
const logger = require('./utils/logger');          // Custom logger for clean console output

// Main execution block
(async () => {
  try {
    logger.info('🚀 Starting Mighty Bat Bot 🦇...');
    await runBot();                                // Launch the main controller logic
    logger.success('✅ All missions completed successfully!');
  } catch (error) {
    logger.error('❌ Bot crashed:', error.message);
    process.exit(1);                               // Exit with failure code for Railway logs
  }
})();
