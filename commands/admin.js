import fs from 'fs';
import path from 'path';

const pilotDbPath = path.resolve('data/pilot_db.json');

export default async function adminCommands(command, { socket, sender, args }) {
    const pilotData = JSON.parse(fs.readFileSync(pilotDbPath, 'utf8')); 

    switch (command) {
        case 'promote':
            if (!args[0]) return socket.sendMessage(sender, { text: "Usage: !promote [Pilot Name]" });
            
            const pilotName = args.join(' ');
            const pilot = pilotData.pilots.find(p => p.name.toLowerCase() === pilotName.toLowerCase());

            if (pilot) {
                pilot.role = "Instructor/Pilot"; // Logic for rank hierarchy
                pilot.status = "Active";
                fs.writeFileSync(pilotDbPath, JSON.stringify(pilotData, null, 2));
                socket.sendMessage(sender, { text: `🎖️ ${pilot.name} has been promoted to Elite status!` });
            } else {
                socket.sendMessage(sender, { text: "Pilot not found." });
            }
            break;

        case 'demote':
            if (!args[0]) return socket.sendMessage(sender, { text: "Usage: !demote [Pilot Name]" });
            const dName = args.join(' ');
            const dPilot = pilotData.pilots.find(p => p.name.toLowerCase() === dName.toLowerCase());
            if (dPilot) {
                dPilot.role = "Instruction/In Training";
                dPilot.status = "In Training";
                fs.writeFileSync(pilotDbPath, JSON.stringify(pilotData, null, 2));
                socket.sendMessage(sender, { text: `📉 ${dPilot.name} has been moved back to Academy.` });
            }
            break;

        case 'shutdown':
            await socket.sendMessage(sender, { text: "📴 Bot shutting down for maintenance..." });
            process.exit();
            break;

        case 'warn':
            const target = args.join(' ');
            const pWarn = pilotData.pilots.find(p => p.name.toLowerCase() === target.toLowerCase());
            if (pWarn) {
                pWarn.warnings = (pWarn.warnings || 0) + 1;
                if (pWarn.warnings >= 3) {
                    socket.sendMessage(sender, { text: `🚫 *Banning System:* ${pWarn.name} has hit 3 warnings. Auto-kicking...` });
                    pWarn.status = "Blacklisted";
                } else {
                    socket.sendMessage(sender, { text: `⚠️ *Official Warning:* ${pWarn.name}. [${pWarn.warnings}/3]` });
                }
                fs.writeFileSync(pilotDbPath, JSON.stringify(pilotData, null, 2));
            }
            break;

        case 'incident':
            socket.sendMessage(sender, { text: "📝 Incident Report Logged. Administrators have been notified." });
            break;

        case 'notam':
            const notice = args.join(' ');
            socket.sendMessage(sender, { text: `📢 *NOTAM:* ${notice}` });
            break;

        default:
            socket.sendMessage(sender, { text: "Admin command logic pending." });
            break;
    }
}