export const userCommands = {
  async profile(msg, sender) {
    // Display user profile information
    return msg.reply(`User profile for ${sender}: Flights completed: 10, Rank: Pilot.`);
  },

  async login(msg, sender) {
    // User login logic
    return msg.reply(`${sender} logged in.`);
  },

  async logout(msg, sender) {
    // User logout logic
    return msg.reply(`${sender} logged out.`);
  }
};