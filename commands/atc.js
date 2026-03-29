export const atcCommands = {
  async clearTakeoff(msg, sender, plane) {
    // Clear plane for takeoff
    return msg.reply(`${plane} cleared for takeoff by ${sender}.`);
  },

  async assignSquawk(msg, sender, plane, squawkCode) {
    // Assign a squawk code to a plane
    return msg.reply(`${plane} squawk code assigned: ${squawkCode}.`);
  },

  async trafficUpdate(msg, sender, airport) {
    // Provide traffic updates for a specific airport
    return msg.reply(`Current traffic at ${airport}: None.`);
  }
};