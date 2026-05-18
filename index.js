const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const cheerio = require('cheerio');
const os = require('os');
const moment = require('moment-timezone');
const Jimp = require('jimp');
const crypto = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser');

// MongoDB Database Functions
const {
    connectdb,
    saveSessionToMongoDB,
    getSessionFromMongoDB,
    deleteSessionFromMongoDB,
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB,
    addNumberToMongoDB,
    removeNumberFromMongoDB,
    getAllNumbersFromMongoDB,
    saveOTPToMongoDB,
    verifyOTPFromMongoDB,
    incrementStats,
    getStatsForNumber,
    saveAutoReplyToMongoDB,
    getAutoRepliesFromMongoDB,
    saveWelcomeMessageToMongoDB,
    getWelcomeMessageFromMongoDB
} = require('./lib/database');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    getContentType,
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    downloadContentFromMessage,
    jidDecode
} = require('@whiskeysockets/baileys');

// Default Configuration
const defaultConfig = {
    WELCOME: 'true',
    AUTO_VIEW_STATUS: 'true',
    AUTO_VOICE: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    AUTO_TYPING: 'true',
    AUTO_REPLY: 'true',
    AUTO_STATUS_REPLY: 'true',
    READ_MESSAGE: 'true',
    ANTI_CALL: 'true',
    ANTI_DELETE: 'true',
    AUTO_BIO: 'true',
    AUTO_LIKE_EMOJI: ['🥹', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'],
    PREFIX: '.',
    MAX_RETRIES: 3,
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/C0CWyj7RapP2vX7vNdUSTK',
    RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',
    NEWSLETTER_JID: '120363402325089913@newsletter',
    NEWSLETTER_MESSAGE_ID: '428',
    OTP_EXPIRY: 300000,
    OWNER_NUMBER: '255612491554',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
    REJECT_MSG: 'Please don\'t call me! 😊',
    BIO_LIST: [
        "🐢 SILA-MD-MINI | 🤖 AI Assistant",
        "🌟 Powered by SILA TECH | 🚀 Fast & Reliable",
        "💫 SILA-MD-MINI Bot | Always Active!",
        "👑 SILA TECH | Mini WhatsApp Bot"
    ]
};

// Connect to MongoDB
connectdb();

// Global variables
const activeSockets = new Map();
const socketCreationTime = new Map();
const SESSION_BASE_PATH = './session';
const otpStore = new Map();

// Ensure session directory exists
if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

// Helper Functions
function safeJSONParse(str, defaultValue = []) {
    try {
        if (!str || str.trim() === '') return defaultValue;
        return JSON.parse(str);
    } catch (error) {
        console.log('❌ JSON parse error:', error.message);
        return defaultValue;
    }
}

function formatMessage(title, content, footer) {
    return `*${title}*\n\n${content}\n\n> *${footer}*`;
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTimestamp() {
    return moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
}

async function resize(image, width, height) {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
}

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}

// Load Plugins
const plugins = new Map();
const pluginDir = path.join(__dirname, 'plugins');
if (fs.existsSync(pluginDir)) {
    fs.readdirSync(pluginDir).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const plugin = require(path.join(pluginDir, file));
                if (plugin.command) {
                    plugins.set(plugin.command, plugin);
                }
            } catch (error) {
                console.log(`❌ Failed to load plugin ${file}:`, error.message);
            }
        }
    });
}

// ==================== HANDLERS ====================

async function loadUserConfig(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const userConfig = await getUserConfigFromMongoDB(sanitizedNumber);
        return { ...defaultConfig, ...userConfig };
    } catch (error) {
        console.log(`❌ Config load failed, using default: ${error.message}`);
        return { ...defaultConfig };
    }
}

async function updateUserConfig(number, newConfig) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        await updateUserConfigInMongoDB(sanitizedNumber, newConfig);
        console.log(`✅ Updated config for ${sanitizedNumber}`);
    } catch (error) {
        console.log(`❌ Config update failed: ${error.message}`);
    }
}

// Auto Bio Setup
async function updateAboutStatus(socket, number) {
    try {
        const userConfig = await loadUserConfig(number);
        if (userConfig.AUTO_BIO !== 'true') return;
        
        const bioList = userConfig.BIO_LIST || defaultConfig.BIO_LIST;
        const randomBio = bioList[Math.floor(Math.random() * bioList.length)];
        
        await socket.updateProfileStatus(randomBio);
        console.log(`✅ Bio updated for ${number}: ${randomBio}`);
    } catch (error) {
        console.error('❌ Failed to update bio:', error);
    }
}

async function updateStoryStatus(socket, number) {
    const statusMessage = `*🐢 SILA MD MINI BOT 🐢*\nConnected at: ${getTimestamp()}`;
    try {
        await socket.sendMessage('status@broadcast', { text: statusMessage });
        console.log(`Posted story status for ${number}`);
    } catch (error) {
        console.error('Failed to post story status:', error);
    }
}

// Newsletter Handlers
async function setupNewsletterHandlers(socket, number) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== defaultConfig.NEWSLETTER_JID) return;

        try {
            const emojis = ['🐢', '❤️', '🔥', '😀', '👍'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const messageId = message.newsletterServerId;

            if (!messageId) return;

            let retries = defaultConfig.MAX_RETRIES;
            while (retries > 0) {
                try {
                    await socket.newsletterReactMessage(
                        defaultConfig.NEWSLETTER_JID,
                        messageId.toString(),
                        randomEmoji
                    );
                    console.log(`Reacted to newsletter message ${messageId} with ${randomEmoji}`);
                    break;
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    await delay(2000);
                }
            }
        } catch (error) {
            console.error('Newsletter reaction error:', error);
        }
    });
}

// Status Handlers
async function setupStatusHandlers(socket, number) {
    const userConfig = await loadUserConfig(number);
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast') return;

        try {
            if (userConfig.AUTO_RECORDING === 'true') {
                await socket.sendPresenceUpdate("recording", message.key.remoteJid);
            }

            if (userConfig.AUTO_VIEW_STATUS === 'true') {
                let retries = defaultConfig.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.readMessages([message.key]);
                        break;
                    } catch (error) {
                        retries--;
                        if (retries === 0) throw error;
                        await delay(1000);
                    }
                }
            }

            if (userConfig.AUTO_LIKE_STATUS === 'true') {
                const emojis = userConfig.AUTO_LIKE_EMOJI || defaultConfig.AUTO_LIKE_EMOJI;
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                let retries = defaultConfig.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            message.key.remoteJid,
                            { react: { text: randomEmoji, key: message.key } },
                            { statusJidList: [message.key.participant] }
                        );
                        console.log(`Reacted to status with ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        if (retries === 0) throw error;
                        await delay(1000);
                    }
                }
            }

            // Auto reply to status with AI
            if (userConfig.AUTO_STATUS_REPLY === 'true') {
                let statusText = '';
                if (message.message?.conversation) {
                    statusText = message.message.conversation;
                } else if (message.message?.extendedTextMessage?.text) {
                    statusText = message.message.extendedTextMessage.text;
                } else if (message.message?.imageMessage?.caption) {
                    statusText = message.message.imageMessage.caption;
                } else if (message.message?.videoMessage?.caption) {
                    statusText = message.message.videoMessage.caption;
                }

                if (statusText) {
                    const aiResponse = await generateAIResponse(statusText);
                    await socket.sendMessage(message.key.participant, { 
                        text: `🤖 *AI Response to your status:*\n\n${aiResponse}`
                    });
                    console.log(`AI replied to status from ${message.key.participant}`);
                }
            }
        } catch (error) {
            console.error('Status handler error:', error);
        }
    });
}

// AI Response Generator
async function generateAIResponse(text) {
    try {
        const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 10000 });
        
        if (response.data?.result) return response.data.result;
        if (response.data?.text) return response.data.text;
        if (typeof response.data === 'string') return response.data;
        
        return "Nimeelewa status yako! Asante kwa kushiriki. 😊";
    } catch (error) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('happy')) return "Ninafurahi kwa ajili yako! 😊";
        if (lowerText.includes('sad')) return "Pole sana, natumai utapata faraja. 💔";
        if (lowerText.includes('love')) return "Upendo ni mzuri sana! ❤️";
        if (lowerText.includes('morning')) return "Habari ya asubuhi! ☀️";
        if (lowerText.includes('night')) return "Lala salama! 🌙";
        return "Nimeona status yako, asante kwa kushiriki! 👍";
    }
}

// Message Revocation Handler
async function handleMessageRevocation(socket, number) {
    socket.ev.on('messages.delete', async ({ keys }) => {
        if (!keys || keys.length === 0) return;

        const userConfig = await loadUserConfig(number);
        if (userConfig.ANTI_DELETE !== 'true') return;

        const messageKey = keys[0];
        const userJid = jidNormalizedUser(socket.user.id);
        
        const message = formatMessage(
            '🗑️ MESSAGE DELETED',
            `A message was deleted from your chat.\n📋 From: ${messageKey.remoteJid}\n🍁 Deletion Time: ${getTimestamp()}`,
            'SILA MD MINI'
        );

        try {
            await socket.sendMessage(userJid, {
                image: { url: defaultConfig.RCD_IMAGE_PATH },
                caption: message
            });
            console.log(`Notified ${number} about message deletion`);
        } catch (error) {
            console.error('Failed to send deletion notification:', error);
        }
    });
}

// Auto Reply Handler from MongoDB
async function setupAutoReplyHandlers(socket, number) {
    const userConfig = await loadUserConfig(number);
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

            let text = '';
            if (msg.message.conversation) {
                text = msg.message.conversation.toLowerCase().trim();
            } else if (msg.message.extendedTextMessage?.text) {
                text = msg.message.extendedTextMessage.text.toLowerCase().trim();
            }

            if (!text || userConfig.AUTO_REPLY !== 'true') return;

            // Get auto-replies from MongoDB
            const autoReplies = await getAutoRepliesFromMongoDB(number);
            
            for (const [trigger, reply] of Object.entries(autoReplies)) {
                if (text === trigger.toLowerCase()) {
                    await socket.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
                    console.log(`Auto-replied to "${trigger}" for ${number}`);
                    break;
                }
            }
        } catch (err) {
            console.error('Auto-reply error:', err);
        }
    });
}

// Welcome Handler
async function setupWelcomeHandlers(socket, number) {
    const userConfig = await loadUserConfig(number);
    
    if (userConfig.WELCOME !== 'true') return;
    
    socket.ev.on('group-participants.update', async (update) => {
        const { id: groupId, participants, action } = update;

        try {
            const welcomeMsg = await getWelcomeMessageFromMongoDB(number);
            
            if (action === 'add') {
                const metadata = await socket.groupMetadata(groupId);
                const groupName = metadata.subject;

                for (const user of participants) {
                    const userName = user.split('@')[0];
                    const welcomeText = welcomeMsg?.welcome || `*╭━━━〔 🐢 SILA MD 🐢 〕━━━┈⊷*
*┃🐢│ GROUP NAME*
*┃🐢│ ${groupName}*

*MOST WELCOME MY DEAR 😍*
*🐢 @${userName} 🐢*
*╰━━━━━━━━━━━━━━━┈⊷*`;

                    await socket.sendMessage(groupId, {
                        image: { url: defaultConfig.RCD_IMAGE_PATH },
                        caption: welcomeText,
                        mentions: [user]
                    });
                    await delay(1000);
                }
            }

            if (action === 'remove') {
                const metadata = await socket.groupMetadata(groupId);
                const groupName = metadata.subject;

                for (const user of participants) {
                    const userName = user.split('@')[0];
                    const leftText = welcomeMsg?.leave || `*╭━━━〔 🐢 SILA MD 🐢 〕━━━┈⊷*
*ALLAH HAFIZ 🥺❤️*
@${userName}* G 🥺
*╰━━━━━━━━━━━━━━━┈⊷*`;

                    await socket.sendMessage(groupId, {
                        image: { url: defaultConfig.RCD_IMAGE_PATH },
                        caption: leftText,
                        mentions: [user]
                    });
                    await delay(1000);
                }
            }
        } catch (err) {
            console.error('Error sending welcome/left message:', err);
        }
    });
}

// Anti-link handler
async function setupAntiLinkHandler(socket, number) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            try {
                const m = msg.message;
                const sender = msg.key.remoteJid;

                if (!m || !sender.endsWith('@g.us')) continue;

                const userConfig = await loadUserConfig(number);
                const isAntilinkOn = userConfig.ANTI_LINK === 'true';
                const body = m.conversation || m.extendedTextMessage?.text || '';

                const groupInviteRegex = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/gi;
                if (isAntilinkOn && groupInviteRegex.test(body)) {
                    const groupMetadata = await socket.groupMetadata(sender);
                    const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                    const isAdmin = groupAdmins.includes(msg.key.participant || msg.participant);

                    if (!isAdmin) {
                        await socket.sendMessage(sender, {
                            text: `🚫 WhatsApp group links are not allowed!`,
                            mentions: [msg.key.participant]
                        }, { quoted: msg });

                        await socket.sendMessage(sender, {
                            delete: {
                                remoteJid: sender,
                                fromMe: false,
                                id: msg.key.id,
                                participant: msg.key.participant
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('Antilink Error:', e.message);
            }
        }
    });
}

// Call Handler
async function setupCallHandlers(socket, number) {
    socket.ev.on('call', async (calls) => {
        try {
            const userConfig = await loadUserConfig(number);
            if (userConfig.ANTI_CALL !== 'true') return;

            for (const call of calls) {
                if (call.status !== 'offer') continue;
                await socket.rejectCall(call.id, call.from);
                await socket.sendMessage(call.from, { 
                    text: userConfig.REJECT_MSG || defaultConfig.REJECT_MSG
                });
                console.log(`Call rejected for ${number} from ${call.from}`);
            }
        } catch (err) {
            console.error(`Anti-call error for ${number}:`, err);
        }
    });
}

// Join Group
async function joinGroup(socket) {
    let retries = defaultConfig.MAX_RETRIES;
    const inviteCodeMatch = defaultConfig.GROUP_INVITE_LINK.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    if (!inviteCodeMatch) {
        console.error('Invalid group invite link format');
        return { status: 'failed', error: 'Invalid group invite link' };
    }
    const inviteCode = inviteCodeMatch[1];

    while (retries > 0) {
        try {
            const response = await socket.groupAcceptInvite(inviteCode);
            if (response?.gid) {
                console.log(`✅ Successfully joined group with ID: ${response.gid}`);
                return { status: 'success', gid: response.gid };
            }
            throw new Error('No group ID in response');
        } catch (error) {
            retries--;
            if (retries === 0) {
                return { status: 'failed', error: error.message };
            }
            await delay(2000);
        }
    }
    return { status: 'failed', error: 'Max retries reached' };
}

// Auto Restart
function setupAutoRestart(socket, number) {
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
            console.log(`Connection lost for ${number}, attempting to reconnect...`);
            await delay(10000);
            activeSockets.delete(number.replace(/[^0-9]/g, ''));
            socketCreationTime.delete(number.replace(/[^0-9]/g, ''));
            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await startBot(number, mockRes);
        }
    });
}

// ==================== COMMAND HANDLER ====================

function setupCommandHandlers(socket, number) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

            let command = null;
            let args = [];
            let from = msg.key.remoteJid;

            if (msg.message.conversation || msg.message.extendedTextMessage?.text) {
                const text = (msg.message.conversation || msg.message.extendedTextMessage.text || '').trim();
                const userConfig = await loadUserConfig(number);
                const prefix = userConfig.PREFIX || defaultConfig.PREFIX;
                
                if (text.startsWith(prefix)) {
                    const parts = text.slice(prefix.length).trim().split(/\s+/);
                    command = parts[0].toLowerCase();
                    args = parts.slice(1);
                }
            } else if (msg.message.buttonsResponseMessage) {
                const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
                const userConfig = await loadUserConfig(number);
                const prefix = userConfig.PREFIX || defaultConfig.PREFIX;
                
                if (buttonId && buttonId.startsWith(prefix)) {
                    const parts = buttonId.slice(prefix.length).trim().split(/\s+/);
                    command = parts[0].toLowerCase();
                    args = parts.slice(1);
                }
            }

            if (!command) return;

            // Increment stats
            await incrementStats(number.replace(/[^0-9]/g, ''), 'commandsUsed');

            // Execute plugin
            if (plugins.has(command)) {
                const plugin = plugins.get(command);
                try {
                    await plugin.execute(socket, msg, args, number);
                } catch (err) {
                    console.error(`❌ Plugin "${command}" error:`, err);
                    await socket.sendMessage(
                        from,
                        {
                            image: { url: defaultConfig.RCD_IMAGE_PATH },
                            caption: formatMessage(
                                '❌ ERROR',
                                `Error with ${command} command:\n${err.message || err}`,
                                '*🐢 SILA MD MINI BOT 🐢*'
                            )
                        },
                        { quoted: msg }
                    );
                }
            }
        } catch (err) {
            console.error('❌ Global handler error:', err);
        }
    });
}

// ==================== MAIN STARTBOT FUNCTION ====================

async function startBot(number, res = null) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    // Check if already connected
    if (activeSockets.has(sanitizedNumber)) {
        console.log(`⏩ ${sanitizedNumber} is already connected`);
        if (res && !res.headersSent) {
            return res.json({ 
                status: 'already_connected', 
                message: 'Number is already connected' 
            });
        }
        return;
    }

    // Clean duplicate files
    try {
        const files = fs.readdirSync(SESSION_BASE_PATH);
        const sessionFiles = files.filter(file => 
            file.includes(sanitizedNumber) && file.endsWith('.json')
        );
        if (sessionFiles.length > 1) {
            const sortedFiles = sessionFiles.sort().reverse();
            for (let i = 1; i < sortedFiles.length; i++) {
                fs.unlinkSync(path.join(SESSION_BASE_PATH, sortedFiles[i]));
            }
        }
    } catch (error) {
        console.log(`⚠️ Clean failed: ${error.message}`);
    }

    // Restore session from MongoDB
    const existingSession = await getSessionFromMongoDB(sanitizedNumber);
    
    if (existingSession) {
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(existingSession, null, 2));
        console.log(`✅ Restored session from MongoDB for ${sanitizedNumber}`);
    } else {
        if (fs.existsSync(sessionPath)) {
            await fs.remove(sessionPath);
        }
        fs.ensureDirSync(sessionPath);
        console.log(`🆕 New session for ${sanitizedNumber}`);
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'fatal' : 'debug' });

    try {
        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger,
            browser: Browsers.macOS('Safari'),
            getMessage: async (key) => {
                return { conversation: 'Hello' };
            }
        });

        socketCreationTime.set(sanitizedNumber, Date.now());
        
        // Setup all handlers
        await setupWelcomeHandlers(socket, sanitizedNumber);
        await setupStatusHandlers(socket, sanitizedNumber);
        await setupCommandHandlers(socket, sanitizedNumber);
        await setupNewsletterHandlers(socket, sanitizedNumber);
        await setupAutoReplyHandlers(socket, sanitizedNumber);
        await handleMessageRevocation(socket, sanitizedNumber);
        await setupAntiLinkHandler(socket, sanitizedNumber);
        await setupCallHandlers(socket, sanitizedNumber);
        setupAutoRestart(socket, sanitizedNumber);

        // Handle pairing for new sessions
        if (!existingSession) {
            setTimeout(async () => {
                try {
                    await delay(1500);
                    const code = await socket.requestPairingCode(sanitizedNumber);
                    console.log(`🔑 Pairing Code for ${sanitizedNumber}: ${code}`);
                    if (res && !res.headersSent) {
                        return res.json({ code, status: 'new_pairing' });
                    }
                } catch (err) {
                    console.error('❌ Pairing error:', err.message);
                    if (res && !res.headersSent) {
                        return res.json({ error: 'Failed to generate pairing code' });
                    }
                }
            }, 3000);
        } else if (res && !res.headersSent) {
            res.json({ status: 'reconnecting', message: 'Reconnecting with existing session' });
        }

        // Save credentials to MongoDB
        socket.ev.on('creds.update', async () => {
            await saveCreds();
            const fileContent = await fs.readFile(path.join(sessionPath, 'creds.json'), 'utf8');
            const creds = JSON.parse(fileContent);
            await saveSessionToMongoDB(sanitizedNumber, creds);
            console.log(`💾 Session saved to MongoDB for ${sanitizedNumber}`);
        });

        // Connection open handler
        socket.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'open') {
                try {
                    await delay(3000);
                    const userJid = jidNormalizedUser(socket.user.id);

                    // Update bio and story
                    await updateAboutStatus(socket, sanitizedNumber);
                    await updateStoryStatus(socket, sanitizedNumber);

                    // Join group
                    await joinGroup(socket);

                    // Follow newsletter
                    try {
                        await socket.newsletterFollow(defaultConfig.NEWSLETTER_JID);
                        await socket.sendMessage(defaultConfig.NEWSLETTER_JID, { 
                            react: { text: '🐢', key: { id: defaultConfig.NEWSLETTER_MESSAGE_ID } } 
                        });
                        console.log('✅ Auto-followed newsletter');
                    } catch (error) {
                        console.error('❌ Newsletter error:', error.message);
                    }

                    // Save to active sockets
                    activeSockets.set(sanitizedNumber, socket);
                    
                    // Add number to MongoDB list
                    await addNumberToMongoDB(sanitizedNumber);

                    // Send success message
                    const successMessage = `*╭━━━〔 🐢 SILA MD 🐢 〕━━━┈⊷*
*┃🐢│ BOT CONNECTED SUCCESSFULLY!*
*┃🐢│ TIME :❯ ${new Date().toLocaleString()}*
*┃🐢│ STATUS :❯ ONLINE AND READY!*
*╰━━━━━━━━━━━━━━━┈⊷*

📢 Make sure to join our channels and groups!`;

                    await socket.sendMessage(userJid, {
                        image: { url: defaultConfig.RCD_IMAGE_PATH },
                        caption: successMessage
                    });

                    console.log(`🎉 ${sanitizedNumber} successfully connected!`);

                } catch (error) {
                    console.error('Connection error:', error);
                }
            }
        });

    } catch (error) {
        console.error('StartBot error:', error);
        socketCreationTime.delete(sanitizedNumber);
        if (res && !res.headersSent) {
            res.status(503).send({ error: 'Service Unavailable' });
        }
    }
}

// ==================== AUTO RECONNECT ====================

async function autoReconnectFromMongoDB() {
    try {
        console.log('🔄 Attempting auto-reconnect from MongoDB...');
        const numbers = await getAllNumbersFromMongoDB();

        if (numbers.length === 0) {
            console.log('ℹ️ No numbers found in MongoDB for auto-reconnect');
            return;
        }

        console.log(`📊 Found ${numbers.length} numbers in MongoDB`);

        for (const number of numbers) {
            if (!activeSockets.has(number)) {
                console.log(`🔁 Reconnecting: ${number}`);
                const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                await startBot(number, mockRes);
                await delay(3000);
            } else {
                console.log(`✅ Already connected: ${number}`);
            }
        }

        console.log('✅ Auto-reconnect completed');
    } catch (error) {
        console.error('❌ Auto-reconnect error:', error.message);
    }
}

// ==================== API ROUTES ====================

router.get('/', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).send({ error: 'Number parameter is required' });
    }

    if (activeSockets.has(number.replace(/[^0-9]/g, ''))) {
        return res.status(200).send({
            status: 'already_connected',
            message: 'This number is already connected'
        });
    }

    await startBot(number, res);
});

router.get('/active', (req, res) => {
    res.status(200).send({
        count: activeSockets.size,
        numbers: Array.from(activeSockets.keys())
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send({
        status: 'active',
        message: '*🐢 SILA MD MINI BOT 🐢*',
        activeSessions: activeSockets.size,
        database: 'MongoDB Connected'
    });
});

router.get('/connect-all', async (req, res) => {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        
        if (numbers.length === 0) {
            return res.status(404).send({ error: 'No numbers found to connect' });
        }

        const results = [];
        for (const number of numbers) {
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await startBot(number, mockRes);
            results.push({ number, status: 'connection_initiated' });
            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            total: numbers.length,
            connections: results
        });
    } catch (error) {
        console.error('Connect all error:', error);
        res.status(500).send({ error: 'Failed to connect all bots' });
    }
});

router.get('/reconnect', async (req, res) => {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        
        if (numbers.length === 0) {
            return res.status(404).send({ error: 'No numbers found to reconnect' });
        }

        const results = [];
        for (const number of numbers) {
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            try {
                await startBot(number, mockRes);
                results.push({ number, status: 'connection_initiated' });
            } catch (error) {
                results.push({ number, status: 'failed', error: error.message });
            }
            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('Reconnect error:', error);
        res.status(500).send({ error: 'Failed to reconnect bots' });
    }
});

router.get('/update-config', async (req, res) => {
    const { number, config: configString } = req.query;
    if (!number || !configString) {
        return res.status(400).json({ error: 'Number and config are required' });
    }

    let newConfig;
    try {
        newConfig = JSON.parse(configString);
    } catch (error) {
        return res.status(400).json({ error: 'Invalid config format' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    
    if (!socket) {
        return res.status(404).json({ error: 'No active session found' });
    }

    const otp = generateOTP();
    await saveOTPToMongoDB(sanitizedNumber, otp, newConfig);

    try {
        const userJid = jidNormalizedUser(socket.user.id);
        await socket.sendMessage(userJid, {
            text: `🔐 *CONFIGURATION UPDATE*\n\nYour OTP: *${otp}*\nValid for 5 minutes\n\nUse: .verify-otp ${otp}`
        });
        res.json({ status: 'otp_sent', message: 'OTP sent to your number' });
    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.get('/verify-otp', async (req, res) => {
    const { number, otp } = req.query;
    if (!number || !otp) {
        return res.status(400).json({ error: 'Number and OTP are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const verification = await verifyOTPFromMongoDB(sanitizedNumber, otp);

    if (!verification.valid) {
        return res.status(400).json({ error: verification.error });
    }

    try {
        await updateUserConfigInMongoDB(sanitizedNumber, verification.config);
        const socket = activeSockets.get(sanitizedNumber);
        if (socket) {
            await socket.sendMessage(jidNormalizedUser(socket.user.id), {
                text: '✅ *CONFIG UPDATED*\n\nYour configuration has been successfully updated!'
            });
        }
        res.json({ status: 'success', message: 'Config updated successfully in MongoDB' });
    } catch (error) {
        console.error('Failed to update config:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

router.get('/stats', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).json({ error: 'Number is required' });
    }

    try {
        const stats = await getStatsForNumber(number);
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const isConnected = activeSockets.has(sanitizedNumber);

        res.json({
            number: sanitizedNumber,
            connectionStatus: isConnected ? 'Connected' : 'Disconnected',
            stats: stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

router.get('/disconnect', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).json({ error: 'Number parameter is required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');

    if (!activeSockets.has(sanitizedNumber)) {
        return res.status(404).json({ error: 'Number not found in active connections' });
    }

    try {
        const socket = activeSockets.get(sanitizedNumber);
        await socket.ws.close();
        socket.ev.removeAllListeners();
        
        activeSockets.delete(sanitizedNumber);
        socketCreationTime.delete(sanitizedNumber);
        await removeNumberFromMongoDB(sanitizedNumber);
        await deleteSessionFromMongoDB(sanitizedNumber);

        console.log(`✅ Disconnected ${sanitizedNumber}`);
        res.json({ status: 'success', message: 'Number disconnected successfully' });
    } catch (error) {
        console.error(`Error disconnecting ${sanitizedNumber}:`, error);
        res.status(500).json({ error: 'Failed to disconnect number' });
    }
});

// ==================== CLEANUP ====================

process.on('exit', () => {
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    exec(`pm2 restart ${process.env.PM2_NAME || 'SILA-MD-MINI-session'}`);
});

// Start auto-reconnect
setTimeout(() => {
    autoReconnectFromMongoDB();
}, 3000);

module.exports = router;
