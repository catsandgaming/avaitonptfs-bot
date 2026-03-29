import cron from "node-cron";
import { load } from "./db.js";

function startScheduler(sock) {
  // Session reminder every minute check
  cron.schedule("* * * * *", () => {
    const sessions = load("./data/sessions.json");

    const now = new Date();
    sessions.forEach(s => {
      const time = new Date(s.time);
      const diff = (time - now) / 60000;

      if (diff > 14 && diff < 16) {
        sock.sendMessage(s.group, {
          text: `⏰ Session starts in 15 minutes`
        });
      }
    });
  });

  // Pilot of the week (Sunday)
  cron.schedule("0 18 * * 0", () => {
    sock.sendMessage("GROUP_ID", {
      text: "🏆 Pilot of the Week selected!"
    });
  });
}

module.exports = { startScheduler };