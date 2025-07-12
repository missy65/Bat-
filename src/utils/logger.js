// src/utils/logger.js

const chalk = require('chalk');

module.exports = {
  info: (...args) => console.log(chalk.cyan('[INFO]'), ...args),
  success: (...args) => console.log(chalk.green('[SUCCESS]'), ...args),
  error: (...args) => console.error(chalk.red('[ERROR]'), ...args),
  warn: (...args) => console.warn(chalk.yellow('[WARN]'), ...args),
};
