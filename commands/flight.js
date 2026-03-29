export const flightCommands = {
  async initiateTakeoff(msg, sender, plane) {
    // Initiate takeoff for a specific plane
    return msg.reply(`Takeoff initiated for ${plane}.`);
  },

  async altitudeSet(msg, sender, altitude) {
    // Set altitude for a flight
    return msg.reply(`Altitude set to ${altitude} feet.`);
  },

  async headingSet(msg, sender, heading) {
    // Set heading for a flight
    return msg.reply(`Heading set to ${heading} degrees.`);
  },

  async landPlane(msg, sender, plane) {
    // Land a specific plane
    return msg.reply(`${plane} is cleared to land.`);
  }
};