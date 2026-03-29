import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys'; 
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import qrcode from 'qrcode-terminal';

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
const AUTH_PATH = './auth_info_multi';

// Command handler
const handleCommand = async (socket, message) => {
  const messageContent = message.message;
  const body = 
    messageContent?.conversation || 
    messageContent?.extendedTextMessage?.text || 
    messageContent?.imageMessage?.caption || 
    messageContent?.videoMessage?.caption || 
    "";
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
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_PATH);

  // Create WASocket
  const socket = makeWASocket({
    auth: state,
    browser: ['PTFS Bot', 'Chrome', '1.0.0']
  });

  // Save credentials whenever updated
  socket.ev.on('creds.update', saveCreds);

  // Handle connection updates
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('New QR code generated. Scan to link:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      if (statusCode === 405) {
        console.error('Critical Connection Error (405): Session Conflict. Clearing session and cooling down...');
        try {
          fs.rmSync(AUTH_PATH, { recursive: true, force: true });
          console.log(`Successfully cleared ${AUTH_PATH}. A new QR will be required.`);
        } catch (err) {
          console.error('Failed to clear session folder:', err);
        }
      } else {
        console.log(`Connection closed (Status: ${statusCode || 'Unknown'}). Reconnecting: ${shouldReconnect}`);
      }
      
      if (shouldReconnect) {
        setTimeout(() => initBot(), 5000); // 5-second delay to prevent loops
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
