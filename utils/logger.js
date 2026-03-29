import fs from 'fs';

export const logger = {
  log: (message) => {
    const time = new Date().toISOString();
    fs.appendFileSync('bot.log', `[${time}] ${message}\n`);
  }
};