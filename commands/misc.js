export const miscCommands = {
  async ping(msg) {
    // Check bot response time
    return msg.reply("Pong! Bot is running smoothly.");
  },

  async status(msg) {
    // Get bot's status
    return msg.reply("Bot is active and operational.");
  },

  async setWeather(msg, sender, airport, weather) {
    // Set the weather for a specific airport
    return msg.reply(`Weather at ${airport} set to ${weather}.`);
  }
};