// src/utils/logger.js

const chalk = require('chalk');

module.exports = {
  info: (msg) => console.log(chalk.blueBright('[INFO]'), msg),
  success: (msg) => console.log(chalk.green('[SUCCESS]'), msg),
  error: (msg) => console.error(chalk.red('[ERROR]'), msg),
};
