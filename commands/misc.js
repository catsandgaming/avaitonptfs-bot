export default async function miscCommands(command, { socket, sender, args }) {
    const helpMenu = `📖 *Aviator PTFS Help Menu*\n\n` +
        `*Pilot:* !score, !stats, !rank, !schedule, !plane, !route, !checklist\n` +
        `*ATC:* !taxi, !takeoff, !altitude, !heading, !landing, !comms, !metar\n` +
        `*Admin:* !promote, !demote, !warn, !notam, !incident\n` +
        `*Misc:* !id, !ping, !weather, !tips, !map, !links, !manual, !vacation`;

    switch (command) {
        case 'ping':
            return socket.sendMessage(sender, { text: "🏓 Pong! Connection is stable." });

        case 'help':
            return socket.sendMessage(sender, { text: helpMenu });

        case 'id':
            return socket.sendMessage(sender, { text: `🪪 *Pilot ID:* PTFS-${Math.random().toString(36).substr(2, 5).toUpperCase()}\nName: Pilot\nRank: Academy` });

        case 'weather':
            const cond = ["CAVOK", "Few Clouds", "Thunderstorms", "Heavy Rain", "Foggy"];
            return socket.sendMessage(sender, { text: `🌦️ *Current Conditions:* ${cond[Math.floor(Math.random() * cond.length)]}` });

        case 'tips':
            const tips = ["Always check your fuel before takeoff.", "Use trim to maintain level flight.", "Flaps 1 for takeoff, Full for landing.", "Watch your airspeed on short final."];
            return socket.sendMessage(sender, { text: `💡 *Flight Tip:* ${tips[Math.floor(Math.random() * tips.length)]}` });

        case 'map':
            return socket.sendMessage(sender, { text: "🗺️ *PTFS Charts:* https://ptfs.fandom.com/wiki/Airports" });

        case 'links':
            return socket.sendMessage(sender, { text: "🔗 *Group Links*\nDiscord: [Redacted]\nRoblox: [Redacted]" });

        case 'manual':
            return socket.sendMessage(sender, { text: "📘 *Flight Manual:* Please read the Group Description for the link to our SOP." });

        case 'rules':
            return socket.sendMessage(sender, { text: "📜 *Flight Deck Conduct*\n1. No spamming radio.\n2. Respect ATC instructions.\n3. Fly realistically." });

        case 'join':
            return socket.sendMessage(sender, { text: "👋 To join, send a friend request to: *AviatorAdmin_Ted*" });

        case 'uptime':
            const uptime = process.uptime();
            return socket.sendMessage(sender, { text: `⏰ *Bot Uptime:* ${Math.floor(uptime / 60)} minutes.` });
            
        case 'xp':
            return socket.sendMessage(sender, { text: "🆙 XP System is currently calculating weekly flight hours..." });

        case 'vacation':
            return socket.sendMessage(sender, { text: "🏖️ You have been marked as *Away from Flight Deck*. Enjoy your leave!" });

        case 'suggest':
            return socket.sendMessage(sender, { text: "📩 Suggestion logged. Ted will review this shortly." });
            
        case 'vouch':
            return socket.sendMessage(sender, { text: "✅ Vouch received. The Academy instructor will review this pilot's performance." });

        case 'radio':
            return socket.sendMessage(sender, { text: "🎙️ *Radio Mode:* Active. Use only short codes." });

        case 'instructor':
            return socket.sendMessage(sender, { text: "👨‍🏫 *Today's Instructor:* Ted S" });

        default:
            break;
    }
}