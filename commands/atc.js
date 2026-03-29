export default async function atcCommands(command, { socket, sender, args }) {
    const info = {
        taxi: "🚕 *Elite Taxiing:* Centerline must be maintained. Max speed 20kts.",
        takeoff: "🛫 *Takeoff:* Rotate at specified Vr. Clean wings by 2000ft.",
        altitude: "🏔️ *Altitude:* Maintain assigned flight level ±100ft.",
        heading: "🧭 *Heading:* Vectors must be followed within 5 degrees.",
        landing: "🛬 *Landing:* TDZ contact required. Centerline maintained.",
        comms: "🎙️ *Approved Comms:* 'Wilco', 'Roger', 'Unable', 'Line up and Wait'.",
        clearance: "✅ You are cleared for the requested procedure. Squawk 7000.",
        vspeeds: "🏎️ *Rotation Speeds:* Airliners: ~140kts | Light: ~65kts | Military: ~160kts",
        metar: "☁️ *METAR:* VFR conditions. Wind 240 at 10kts. Altimeter 29.92."
    };

    if (info[command]) {
        return socket.sendMessage(sender, { text: info[command] });
    } else {
        return socket.sendMessage(sender, { text: "ATC Command logic is active." });
    }
}