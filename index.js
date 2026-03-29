import pkg from '@adiwajshing/baileys'; 
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from `.env` file
dotenv.config();

// Load necessary functions from bailey's package
const { makeWASocket, useSingleFileAuthState } = pkg;

// Import command files
import { adminCommands } from './commands/admin.js';
import atcCommands from './commands/atc.js';
import flightCommands from './commands/flight.js';
import funCommands from './commands/fun.js';
import miscCommands from './commands/misc.js';

// Define file paths for storing state and auth data
const AUTH_FILE_PATH = './auth_info.json';
const { state, saveState } = useSingleFileAuthState(AUTH_FILE_PATH);

// Create WASocket for interacting with WhatsApp
const socket = makeWASocket({
  auth: state,
});

// Save authentication state to file whenever it changes
socket.ev.on('creds.update', saveState);

// Debugging purpose - logs bot connection
socket.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update;

  if (connection === 'close') {
    const reason = lastDisconnect.error?.output?.statusCode;
    console.log('Connection closed due to:', reason);
  }
  
  if (connection === 'open') {
    console.log('Connection established!');
  }
});

// Prepare and load bot commands
const commandPrefix = '!'; // Prefix for commands

// Command handler
const handleCommand = async (message) => {
  const { body, sender } = message;

  if (body.startsWith(commandPrefix)) {
    const command = body.slice(commandPrefix.length).trim().toLowerCase();

    // Example of command routing
    if (command.startsWith('admin')) {
      adminCommands(socket, message);
    } else if (command.startsWith('atc')) {
      atcCommands(socket, message);
    } else if (command.startsWith('flight')) {
      flightCommands(socket, message);
    } else if (command.startsWith('fun')) {
      funCommands(socket, message);
    } else if (command.startsWith('misc')) {
      miscCommands(socket, message);
    } else {
      socket.sendMessage(sender, { text: 'Unknown command!' });
    }
  }
};

// Listen for incoming messages
socket.ev.on('messages.upsert', async (m) => {
  const message = m.messages[0];
  if (!message.key.fromMe) {
    handleCommand(message);
  }
});

// Initialize the bot on start-up
const initBot = () => {
  console.log('Bot starting...');

  // Authenticate bot using stored credentials or perform login
  socket.ev.on('open', () => {
    console.log('Bot connected to WhatsApp');
  });

  socket.ev.on('close', async () => {
    console.log('Bot disconnected. Reconnecting...');
    await socket.connect();
  });

  // Connecting to WhatsApp
  socket.connect();
};

// Run bot
initBot();
