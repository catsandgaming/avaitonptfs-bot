import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'; 
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from `.env` file
dotenv.config();

// Import command files
import adminCommands from './commands/admin.js';
import atcCommands from './commands/atc.js';
import flightCommands from './commands/flight.js';
import funCommands from './commands/fun.js';
import miscCommands from './commands/misc.js';

// Prepare and load bot commands
const commandPrefix = '!'; // Prefix for commands

// Command handler
const handleCommand = async (socket, message) => {
  const body = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
  const sender = message.key.remoteJid;

  // Spam Filter: Deletes "Pluh" or "Bro" (Simulation - usually requires admin perms)
  if (body.toLowerCase().includes("pluh") || body.toLowerCase().includes("bro")) {
    console.log(`[Spam Filter] Flagged message from ${sender}`);
    // socket.sendMessage(sender, { delete: message.key }); // Requires being admin in group
  }

  if (body.startsWith(commandPrefix)) {
    const args = body.slice(commandPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const context = { socket, message, args, sender };

    // Admin Commands
    if (['promote', 'demote', 'reset', 'warn', 'kick', 'shutdown', 'notam', 'incident'].includes(command)) {
      return adminCommands(command, context);
    }
    
    // ATC Commands
    if (['atc', 'taxi', 'takeoff', 'altitude', 'heading', 'landing', 'comms', 'vector', 'metar', 'clearance', 'gate', 'vspeeds'].includes(command)) {
      return atcCommands(command, context);
    }

    // Flight/Pilot Commands
    if (['score', 'stats', 'rank', 'schedule', 'leaderboard', 'book', 'sessions', 'plane', 'route', 'fuel', 'checklist', 'academy', 'pro', 'logs', 'active', 'session-type', 'promotion-reqs'].includes(command)) {
      return flightCommands(command, context);
    }

    // Fun Commands
    if (['roger', 'butter', 'emergency', 'squawk', 'stall', 'target', 'joke', 'trivia'].includes(command)) {
      return funCommands(command, context);
    }

    // Misc/Info Commands
    if (['help', 'id', 'weather', 'ping', 'tips', 'map', 'uptime', 'links', 'suggest', 'manual', 'vacation', 'compare', 'xp', 'badges', 'instructor', 'alert', 'radio', 'debrief', 'vouch', 'join', 'rules'].includes(command)) {
      return miscCommands(command, context);
    }
  }
};

// Initialize the bot on start-up
const initBot = async () => {
  console.log('Bot starting...');

  // Define folder for multi-file auth state
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_multi');

  // Create WASocket
  const socket = makeWASocket({
    auth: state
  });

  // Save credentials whenever updated
  socket.ev.on('creds.update', saveCreds);

  // Handle connection updates
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        initBot();
      }
    } else if (connection === 'open') {
      console.log('Connection established!');
    }
  });

  // Listen for incoming messages
  socket.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    if (!message.key.fromMe && m.type === 'notify') {
      await handleCommand(socket, message);
    }
  });
};

// Run bot
initBot();
