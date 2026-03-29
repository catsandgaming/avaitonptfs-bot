export const cooldowns = {
  userCooldowns: {},

  isOnCooldown(user) {
    const currentTime = Date.now();
    if (this.userCooldowns[user] && this.userCooldowns[user] > currentTime) {
      return true;
    }
    return false;
  },

  setCooldown(user, cooldownTime) {
    const currentTime = Date.now();
    this.userCooldowns[user] = currentTime + cooldownTime;
  }
};