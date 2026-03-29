import cron from "node-cron";
import fs from 'fs';
import path from 'path';

export function startScheduler(sock) {
  const sessionPath = path.resolve('data/sessions.json');

  // Session reminder every minute check
  cron.schedule("* * * * *", () => {
    const sessions = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));

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