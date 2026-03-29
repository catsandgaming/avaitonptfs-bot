import fs from 'fs';
import path from 'path';

const pilotDbPath = path.resolve('data/pilot_db.json');
const planesPath = path.resolve('data/planes.json');

export default async function flightCommands(command, { socket, sender, args }) {
    const pilotData = JSON.parse(fs.readFileSync(pilotDbPath, 'utf8'));
    const planeData = JSON.parse(fs.readFileSync(planesPath, 'utf8'));

    switch (command) {
        case 'plane':
            if (!args[0]) return socket.sendMessage(sender, { text: "Usage: !plane [name] (e.g., !plane A320)" });
            
            const query = args.join(' ').toLowerCase();
            let foundPlane = null;
            let categoryName = "";

            for (const [cat, planes] of Object.entries(planeData)) {
                const match = Object.entries(planes).find(([name]) => name.toLowerCase().includes(query));
                if (match) {
                    foundPlane = { name: match[0], ...match[1] };
                    categoryName = cat;
                    break;
                }
            }

            if (foundPlane) {
                const response = `✈️ *Aircraft Details*\n\n` +
                    `*Model:* ${foundPlane.name}\n` +
                    `*Category:* ${categoryName}\n` +
                    `*Max Speed:* ${foundPlane.speed} knots\n` +
                    `*Gamepass:* ${foundPlane.gamepass ? "✅" : "❌"}\n` +
                    `*Group Required:* ${foundPlane.group ? "✅" : "❌"}`;
                socket.sendMessage(sender, { text: response });
            } else {
                socket.sendMessage(sender, { text: "Plane not found in database." });
            }
            break;

        case 'score':
            if (args.length < 1) return socket.sendMessage(sender, { text: "Usage: !score [Grade 1-6]" });
            const grade = parseInt(args[0]);
            if (isNaN(grade) || grade < 1 || grade > 6) {
                return socket.sendMessage(sender, { text: "❌ Invalid grade. Please enter 1 to 6." });
            }

            // Auto-Grade Logic
            const gradeMap = { 1: "Fail", 2: "Poor", 3: "Average", 4: "Good", 5: "Great", 6: "Elite/Perfect" };
            const pilot = pilotData.pilots[0]; // Logic to find pilot by sender needed here

            if (pilot) {
                pilot.flights = (typeof pilot.flights === 'number' ? pilot.flights : 0) + 1;
                pilot.totalPoints = (pilot.totalPoints || 0) + grade;
                
                // Instructor Alert if points high
                if (grade >= 5) {
                    socket.sendMessage(sender, { text: `🚨 *Instructor Alert:* High performing flight logged (${gradeMap[grade]})!` });
                }

                // History logging simulation
                console.log(`[History Log] Pilot ${pilot.name} scored ${grade}`);
                fs.writeFileSync(pilotDbPath, JSON.stringify(pilotData, null, 2));
                socket.sendMessage(sender, { text: `✅ Scorecard submitted! Total flights: ${pilot.flights}.` });
            }
            break;

        case 'stats':
            // Placeholder for actual pilot lookup
            const stats = pilotData.pilots[0]; // Example: getting the first pilot
            const statMsg = `📊 *Pilot Stats: ${stats.name}*\n\n` +
                `*Role:* ${stats.role}\n` +
                `*Flights:* ${stats.flights}\n` +
                `*Status:* ${stats.status}`;
            socket.sendMessage(sender, { text: statMsg });
            break;

        case 'leaderboard':
            const topPilots = [...pilotData.pilots]
                .filter(p => typeof p.flights === 'number')
                .sort((a, b) => b.flights - a.flights)
                .slice(0, 10);
            
            let lbMsg = "🏆 *Weekly Top 10 Pilots*\n\n";
            topPilots.forEach((p, i) => lbMsg += `${i+1}. ${p.name} - ${p.flights} flights\n`);
            socket.sendMessage(sender, { text: lbMsg });
            break;
            
        case 'route':
            const airports = ["Greater Tokyo", "Perth", "Inland", "Saphire-Coast", "Darlington"];
            const origin = airports[Math.floor(Math.random() * airports.length)];
            const dest = airports.filter(a => a !== origin)[Math.floor(Math.random() * (airports.length - 1))];
            socket.sendMessage(sender, { text: `📍 *Random Route Generated*\n\n*Origin:* ${origin}\n*Destination:* ${dest}\n\nSafe flight, Captain!` });
            break;

        case 'academy':
            const trainees = pilotData.pilots.filter(p => p.status === "In Training");
            let acMsg = "🎓 *Academy Pilots*\n\n";
            trainees.forEach(p => acMsg += `- ${p.name}\n`);
            socket.sendMessage(sender, { text: acMsg });
            break;

        case 'pro':
            const pros = pilotData.pilots.filter(p => p.role.includes("Instructor") || p.status === "Active");
            let proMsg = "🎖️ *Elite/Pro Pilots*\n\n";
            pros.forEach(p => proMsg += `- ${p.name}\n`);
            socket.sendMessage(sender, { text: proMsg });
            break;

        case 'fuel':
            return socket.sendMessage(sender, { text: "⛽ *Fuel Calculator:* Use 100% for international, 50% for regional, 25% for pattern work." });

        case 'checklist':
            return socket.sendMessage(sender, { text: "📝 *Pre-Flight Checklist*\n1. Check Weight/Balance\n2. Set Flaps\n3. Lights On\n4. Request Pushback" });

        case 'sessions':
            return socket.sendMessage(sender, { text: "📅 *Upcoming Sessions*\nSunday: Mixed Flight (6PM GMT)\nWednesday: Pro-Training (8PM GMT)" });

        case 'book':
            return socket.sendMessage(sender, { text: "🎟️ Slot reserved! Ensure you are online 10 minutes before the session." });

        case 'active':
            return socket.sendMessage(sender, { text: "🛰️ *Active Pilots:* 4 aircraft currently in the air." });

        case 'promotion-reqs':
            return socket.sendMessage(sender, { text: "📈 *Elite Requirements:*\n- 50+ Logged Flights\n- Passed Level 2 Checkride\n- Clean Conduct Record" });

        default:
            socket.sendMessage(sender, { text: "Flight command recognized but logic is being finalized." });
            break;
    }
}