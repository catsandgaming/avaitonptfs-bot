export default async function funCommands(command, { socket, sender }) {
    switch (command) {
        case 'joke':
            const jokes = [
                "Why did the airplane break up? It had too many \"wings\".",
                "What do you call a space magician? A flying saucer-er.",
                "How do you know if there's a pilot at your party? They'll tell you."
            ];
            return socket.sendMessage(sender, { text: jokes[Math.floor(Math.random() * jokes.length)] });

        case 'trivia':
            return socket.sendMessage(sender, { text: "✈️ *Aviation Trivia*\n\nQuestion: What is the fastest air-breathing manned aircraft ever built?\n\n(Reply with the answer to win bragging rights!)" });

        case 'roger':
            return socket.sendMessage(sender, { text: "Wilco. 🫡" });

        case 'butter':
            return socket.sendMessage(sender, { text: "🧈 *LANDING GRADE:* 10/10 - Absolute Butter! Smooth as silk." });

        case 'emergency':
            const failures = ["Engine Fire", "Hydraulic Failure", "Bird Strike", "Total Electrical Failure", "Landing Gear Jam"];
            const failure = failures[Math.floor(Math.random() * failures.length)];
            return socket.sendMessage(sender, { text: `⚠️ *EMERGENCY ASSIGNED:* ${failure}. Declare Mayday and follow checklist procedures.` });

        case 'squawk':
            const code = Math.floor(1000 + Math.random() * 8999);
            return socket.sendMessage(sender, { text: `📡 *Transponder:* Squawk ${code}.` });

        case 'stall':
            return socket.sendMessage(sender, { text: "🛑 *Stall Recovery:* Nose down, wings level, full power. Ensure you have sufficient altitude." });

        case 'target':
            const alt = Math.floor(Math.random() * 30 + 5) * 1000;
            return socket.sendMessage(sender, { text: `🎯 *Altitude Challenge:* Hold exactly ${alt}ft for the duration of your cruise.` });

        default:
            break;
    }
}