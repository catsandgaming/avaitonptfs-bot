export const funCommands = {
  async joke(msg) {
    // Send a random aviation joke
    return msg.reply("Why did the airplane break up? It had too many \"wings\".");
  },

  async trivia(msg) {
    // Start a trivia game
    return msg.reply("Welcome to aviation trivia! Here's your first question: What is the fastest airplane ever built?");
  },

  async randomFlight(msg) {
    // Start a random flight simulation
    return msg.reply("Starting a random flight! Good luck!");
  }
};