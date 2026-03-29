export default async function userCommands(command, { socket, sender }) {
    switch (command) {
        case 'profile':
            return socket.sendMessage(sender, { text: `User profile for ${sender}: Flights completed: 10, Rank: Pilot.` });

        case 'login':
            return socket.sendMessage(sender, { text: `${sender} logged in.` });

        case 'logout':
            return socket.sendMessage(sender, { text: `${sender} logged out.` });

        default:
            break;
    }
}