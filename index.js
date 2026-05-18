const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const os = require('os');
const moment = require('moment-timezone');
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
    deleteAutoReplyFromMongoDB,
    saveWelcomeMessageToMongoDB,
    getWelcomeMessageFromMongoDB,
    updateMongoDBURI,
    getMongoDBURI
} = require('./lib/database');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    getContentType,
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
    AUTO_LIKE_EMOJI: ['💥', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'],
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

// Admin PIN
const ADMIN_PIN = 'sila0022';

// Ensure session directory exists
if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

// Helper Functions
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
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

async function loadUserConfig(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const userConfig = await getUserConfigFromMongoDB(sanitizedNumber);
        return { ...defaultConfig, ...userConfig };
    } catch (error) {
        return { ...defaultConfig };
    }
}

// ==================== LOAD PLUGINS WITH LOGGING ====================

console.log('\n╔════════════════════════════════════════╗');
console.log('║     📦 LOADING PLUGINS SYSTEM        ║');
console.log('╚════════════════════════════════════════╝\n');

const plugins = new Map();
const pluginDir = path.join(__dirname, 'plugins');

// Create plugins directory if it doesn't exist
if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
    console.log('📁 Created plugins directory');
}

// Load plugins from plugins folder
if (fs.existsSync(pluginDir)) {
    const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));
    
    console.log(`🔍 Found ${files.length} plugin files\n`);
    
    let loadedCount = 0;
    let failedCount = 0;
    
    for (const file of files) {
        try {
            const plugin = require(path.join(pluginDir, file));
            if (plugin.command) {
                plugins.set(plugin.command, plugin);
                loadedCount++;
                console.log(`   ✅ LOADED: ${plugin.command} → ${file}`);
                if (plugin.description) {
                    console.log(`      📝 Description: ${plugin.description}`);
                }
                if (plugin.alias && plugin.alias.length > 0) {
                    console.log(`      🔄 Aliases: ${plugin.alias.join(', ')}`);
                }
            } else {
                console.log(`   ⚠️ SKIPPED: ${file} (no command export)`);
                failedCount++;
            }
        } catch (error) {
            failedCount++;
            console.log(`   ❌ FAILED: ${file} → ${error.message}`);
        }
    }
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log(`║  ✅ Loaded: ${loadedCount} commands`);
    console.log(`║  ❌ Failed: ${failedCount} files`);
    console.log(`║  📦 Total: ${plugins.size} active commands`);
    console.log('╚════════════════════════════════════════╝\n');
    
    // List all loaded commands
    if (plugins.size > 0) {
        console.log('📋 Available Commands:');
        const commands = Array.from(plugins.keys()).sort();
        const columns = 4;
        let line = '';
        commands.forEach((cmd, i) => {
            line += `  .${cmd.padEnd(12)}`;
            if ((i + 1) % columns === 0 || i === commands.length - 1) {
                console.log(line);
                line = '';
            }
        });
        console.log('');
    }
} else {
    console.log('⚠️ Plugins directory not found!');
    console.log('📁 Created plugins directory at:', pluginDir);
}

// Also load from silatech directory (legacy support)
const silatechDir = path.join(__dirname, 'silatech');
if (fs.existsSync(silatechDir)) {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     📦 LOADING SILATECH MODULES      ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    const silatechFiles = fs.readdirSync(silatechDir).filter(file => file.endsWith('.js'));
    let silatechLoaded = 0;
    
    for (const file of silatechFiles) {
        try {
            require(path.join(silatechDir, file));
            silatechLoaded++;
            console.log(`   ✅ LOADED: ${file}`);
        } catch (error) {
            console.log(`   ❌ FAILED: ${file} → ${error.message}`);
        }
    }
    console.log(`\n✅ Loaded ${silatechLoaded} silatech modules\n`);
}

// ==================== COMMAND HANDLER WITH PING ====================

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
            }

            if (!command) return;

            console.log(`📝 Command received: ${command} from ${from} on bot ${number}`);

            // ============ PING COMMAND ============
            if (command === 'ping') {
                const start = Date.now();
                await socket.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: msg });
                const end = Date.now();
                const ping = end - start;
                
                const uptime = process.uptime();
                const uptimeString = formatUptime(uptime);
                
                await socket.sendMessage(from, { 
                    text: `*🏓 PONG!*\n\n📡 *Ping:* ${ping}ms\n🤖 *Bot:* Active\n💾 *Database:* MongoDB Connected\n⏱️ *Uptime:* ${uptimeString}\n🕐 *Time:* ${new Date().toLocaleString()}\n\n> 🐢 SILA MD MINI BOT`
                }, { quoted: msg });
                console.log(`✅ Ping command executed: ${ping}ms`);
                return;
            }
            
            // ============ STATS COMMAND ============
            if (command === 'stats' || command === 'status') {
                const activeCount = activeSockets.size;
                const memoryUsage = process.memoryUsage();
                const uptime = process.uptime();
                
                let statsText = `*📊 BOT STATISTICS*\n\n`;
                statsText += `🤖 *Active Sessions:* ${activeCount}\n`;
                statsText += `⏱️ *Uptime:* ${formatUptime(uptime)}\n`;
                statsText += `💾 *Memory Usage:* ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
                statsText += `📡 *Node Version:* ${process.version}\n`;
                statsText += `🔧 *Commands Loaded:* ${plugins.size}\n`;
                statsText += `🕐 *Time:* ${new Date().toLocaleString()}\n\n`;
                statsText += `> 🐢 SILA MD MINI BOT`;
                
                await socket.sendMessage(from, { text: statsText }, { quoted: msg });
                console.log(`✅ Stats command executed`);
                return;
            }
            
            // ============ CONNECTIONS COMMAND ============
            if (command === 'connections' || command === 'sessions') {
                const numbers = Array.from(activeSockets.keys());
                
                if (numbers.length === 0) {
                    await socket.sendMessage(from, { text: '❌ No active connections found.' }, { quoted: msg });
                    return;
                }
                
                let connectionsText = `*📱 ACTIVE CONNECTIONS*\n\n`;
                for (const num of numbers) {
                    const creationTime = socketCreationTime.get(num);
                    const uptime = creationTime ? Math.floor((Date.now() - creationTime) / 1000) : 0;
                    connectionsText += `📱 *+${num}*\n`;
                    connectionsText += `   ⏱️ Uptime: ${formatUptime(uptime)}\n\n`;
                }
                connectionsText += `📊 *Total:* ${numbers.length} active\n`;
                connectionsText += `> 🐢 SILA MD MINI BOT`;
                
                await socket.sendMessage(from, { text: connectionsText }, { quoted: msg });
                console.log(`✅ Connections command executed`);
                return;
            }
            
            // ============ MENU COMMAND ============
            if (command === 'menu' || command === 'help') {
                let menuText = `*╭━━━〔 🐢 SILA MD MENU 🐢 〕━━━┈⊷*\n`;
                menuText += `*┃🐢│ BOT COMMANDS*\n`;
                menuText += `*┃🐢│ Prefix: ${defaultConfig.PREFIX}*\n`;
                menuText += `*╰━━━━━━━━━━━━━━━┈⊷*\n\n`;
                
                menuText += `*📋 BASIC COMMANDS*\n`;
                menuText += `┌─────────────────────┈⊷\n`;
                menuText += `│ ${defaultConfig.PREFIX}ping - Check bot response\n`;
                menuText += `│ ${defaultConfig.PREFIX}stats - Bot statistics\n`;
                menuText += `│ ${defaultConfig.PREFIX}connections - Active sessions\n`;
                menuText += `│ ${defaultConfig.PREFIX}menu - Show this menu\n`;
                menuText += `└─────────────────────┈⊷\n\n`;
                
                // Add plugin commands
                if (plugins.size > 0) {
                    menuText += `*🔧 PLUGIN COMMANDS*\n`;
                    menuText += `┌─────────────────────┈⊷\n`;
                    const pluginCommands = Array.from(plugins.keys()).sort();
                    for (const cmd of pluginCommands) {
                        const plugin = plugins.get(cmd);
                        const desc = plugin.description ? ` - ${plugin.description}` : '';
                        menuText += `│ ${defaultConfig.PREFIX}${cmd}${desc}\n`;
                    }
                    menuText += `└─────────────────────┈⊷\n\n`;
                }
                
                menuText += `*🔗 LINKS*\n`;
                menuText += `┌─────────────────────┈⊷\n`;
                menuText += `│ 📢 Channel: ${defaultConfig.CHANNEL_LINK}\n`;
                menuText += `│ 👥 Group: ${defaultConfig.GROUP_INVITE_LINK}\n`;
                menuText += `│ 👑 Owner: wa.me/${defaultConfig.OWNER_NUMBER}\n`;
                menuText += `└─────────────────────┈⊷\n\n`;
                
                menuText += `> 🐢 SILA MD MINI BOT`;
                
                await socket.sendMessage(from, { 
                    image: { url: defaultConfig.RCD_IMAGE_PATH },
                    caption: menuText 
                }, { quoted: msg });
                console.log(`✅ Menu command executed`);
                return;
            }
            
            // ============ OWNER COMMAND ============
            if (command === 'owner') {
                const ownerText = `*👑 OWNER INFORMATION*\n\n📱 *Number:* wa.me/${defaultConfig.OWNER_NUMBER}\n📢 *Channel:* ${defaultConfig.CHANNEL_LINK}\n👥 *Group:* ${defaultConfig.GROUP_INVITE_LINK}\n\n> 🐢 SILA MD MINI BOT`;
                await socket.sendMessage(from, { text: ownerText }, { quoted: msg });
                return;
            }
            
            // ============ DISCONNECT COMMAND ============
            if (command === 'disconnect' && args.length > 0) {
                const targetNumber = args[0].replace(/[^0-9]/g, '');
                const userConfig = await loadUserConfig(number);
                const ownerNumber = userConfig.OWNER_NUMBER || defaultConfig.OWNER_NUMBER;
                const senderNumber = msg.key.remoteJid.split('@')[0];
                
                if (senderNumber !== ownerNumber && !msg.key.fromMe) {
                    await socket.sendMessage(from, { text: '❌ Only owner can use this command!' }, { quoted: msg });
                    return;
                }
                
                if (!activeSockets.has(targetNumber)) {
                    await socket.sendMessage(from, { text: `❌ Number +${targetNumber} is not connected.` }, { quoted: msg });
                    return;
                }
                
                try {
                    const targetSocket = activeSockets.get(targetNumber);
                    await targetSocket.ws.close();
                    targetSocket.ev.removeAllListeners();
                    
                    activeSockets.delete(targetNumber);
                    socketCreationTime.delete(targetNumber);
                    await removeNumberFromMongoDB(targetNumber);
                    await deleteSessionFromMongoDB(targetNumber);
                    
                    await socket.sendMessage(from, { text: `✅ Successfully disconnected +${targetNumber}` }, { quoted: msg });
                    console.log(`✅ Disconnected ${targetNumber} via command`);
                } catch (error) {
                    await socket.sendMessage(from, { text: `❌ Failed to disconnect: ${error.message}` }, { quoted: msg });
                }
                return;
            }

            // ============ EXECUTE PLUGIN COMMANDS ============
            if (plugins.has(command)) {
                const plugin = plugins.get(command);
                try {
                    console.log(`🔧 Executing plugin: ${command}`);
                    await plugin.execute(socket, msg, args, number);
                    await incrementStats(number.replace(/[^0-9]/g, ''), 'commandsUsed');
                    console.log(`✅ Plugin ${command} executed successfully`);
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
                return;
            }
            
            // If command not found
            await socket.sendMessage(from, { 
                text: `❌ Command "${command}" not found. Type ${defaultConfig.PREFIX}menu to see available commands.` 
            }, { quoted: msg });
            
        } catch (err) {
            console.error('❌ Command handler error:', err);
        }
    });
}

// ==================== AUTO REPLY HANDLER ====================

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

            const autoReplies = await getAutoRepliesFromMongoDB(number);
            
            for (const [trigger, reply] of Object.entries(autoReplies)) {
                if (text === trigger.toLowerCase()) {
                    await socket.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
                    console.log(`🤖 Auto-replied to "${trigger}" for ${number}`);
                    break;
                }
            }
            
            // Default auto replies
            const defaultReplies = {
                'hi': 'Hello! 👋 How can I help you?',
                'hello': 'Hi there! 😊 Use .menu to see commands',
                'mambo': 'Poa sana! 👋 Nikusaidie kuhusu?',
                'habari': 'Nzuri sana! 👋 Habari yako?',
                'thanks': 'You\'re welcome! 😊',
                'asante': 'Karibu sana! 😊',
                'bot': 'Yes, I am SILA MD MINI BOT! 🤖'
            };
            
            if (defaultReplies[text] && userConfig.AUTO_REPLY === 'true') {
                await socket.sendMessage(msg.key.remoteJid, { text: defaultReplies[text] }, { quoted: msg });
                console.log(`🤖 Auto-replied to "${text}" for ${number}`);
            }
        } catch (err) {
            console.error('Auto-reply error:', err);
        }
    });
}

// ==================== STATUS HANDLER ====================

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
                        break;
                    } catch (error) {
                        retries--;
                        if (retries === 0) throw error;
                        await delay(1000);
                    }
                }
            }
        } catch (error) {
            console.error('Status handler error:', error);
        }
    });
}

// ==================== WELCOME HANDLER ====================

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
*┃🐢│ WELCOME TO ${groupName}*
*┃🐢│ Hello @${userName} 🐢*
*┃🐢│ Enjoy our group!*
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
                for (const user of participants) {
                    const userName = user.split('@')[0];
                    const leftText = welcomeMsg?.leave || `*╭━━━〔 🐢 SILA MD 🐢 〕━━━┈⊷*
*ALLAH HAFIZ @${userName} 🥺*
*We will miss you!*
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

// ==================== ANTI-LINK HANDLER ====================

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
                        console.log(`🚫 Deleted group link from ${msg.key.participant}`);
                    }
                }
            } catch (e) {
                console.error('Antilink Error:', e.message);
            }
        }
    });
}

// ==================== CALL HANDLER ====================

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
                console.log(`📞 Call rejected for ${number} from ${call.from}`);
            }
        } catch (err) {
            console.error(`Anti-call error for ${number}:`, err);
        }
    });
}

// ==================== JOIN GROUP ====================

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
            console.log(`⚠️ Join group attempt failed (${retries} retries left):`, error.message);
            if (retries === 0) {
                return { status: 'failed', error: error.message };
            }
            await delay(2000);
        }
    }
    return { status: 'failed', error: 'Max retries reached' };
}

// ==================== AUTO RESTART ====================

function setupAutoRestart(socket, number) {
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
            console.log(`⚠️ Connection lost for ${number}, attempting to reconnect...`);
            await delay(10000);
            activeSockets.delete(number.replace(/[^0-9]/g, ''));
            socketCreationTime.delete(number.replace(/[^0-9]/g, ''));
            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await startBot(number, mockRes);
        }
    });
}

// ==================== AUTO BIO UPDATE ====================

async function updateAboutStatus(socket, number) {
    try {
        const userConfig = await loadUserConfig(number);
        if (userConfig.AUTO_BIO !== 'true') return;
        
        const bioList = userConfig.BIO_LIST || defaultConfig.BIO_LIST;
        const randomBio = bioList[Math.floor(Math.random() * bioList.length)];
        
        await socket.updateProfileStatus(randomBio);
        console.log(`📝 Bio updated for ${number}: ${randomBio}`);
    } catch (error) {
        console.error('❌ Failed to update bio:', error);
    }
}

// ==================== MAIN STARTBOT FUNCTION ====================

async function startBot(number, res = null) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    if (activeSockets.has(sanitizedNumber)) {
        console.log(`⏩ ${sanitizedNumber} is already connected`);
        if (res && typeof res.json === 'function' && !res.headersSent) {
            return res.json({ 
                status: 'already_connected', 
                message: 'Number is already connected' 
            });
        }
        return;
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
        await setupAutoReplyHandlers(socket, sanitizedNumber);
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
                    if (res && typeof res.json === 'function' && !res.headersSent) {
                        return res.json({ code, status: 'new_pairing' });
                    }
                } catch (err) {
                    console.error('❌ Pairing error:', err.message);
                    if (res && typeof res.json === 'function' && !res.headersSent) {
                        return res.json({ error: 'Failed to generate pairing code' });
                    }
                }
            }, 3000);
        } else if (res && typeof res.json === 'function' && !res.headersSent) {
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

                    await updateAboutStatus(socket, sanitizedNumber);
                    
                    // Join group
                    const groupResult = await joinGroup(socket);
                    if (groupResult.status === 'success') {
                        console.log(`✅ Bot joined group for ${sanitizedNumber}`);
                    }

                    // Follow newsletter
                    try {
                        await socket.newsletterFollow(defaultConfig.NEWSLETTER_JID);
                        console.log('✅ Auto-followed newsletter');
                    } catch (error) {
                        console.error('❌ Newsletter error:', error.message);
                    }

                    activeSockets.set(sanitizedNumber, socket);
                    await addNumberToMongoDB(sanitizedNumber);

                    const successMessage = `*╭━━━〔 🐢 SILA MD 🐢 〕━━━┈⊷*
*┃🐢│ BOT CONNECTED SUCCESSFULLY!*
*┃🐢│ TIME :❯ ${new Date().toLocaleString()}*
*┃🐢│ STATUS :❯ ONLINE AND READY!*
*╰━━━━━━━━━━━━━━━┈⊷*

📢 Make sure to join our channels and groups!

🔗 Group: ${defaultConfig.GROUP_INVITE_LINK}
📢 Channel: ${defaultConfig.CHANNEL_LINK}`;

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
        if (res && typeof res.json === 'function' && !res.headersSent) {
            res.status(503).json({ error: 'Service Unavailable' });
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

// Main pairing route
router.get('/', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).json({ error: 'Number parameter is required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');

    if (activeSockets.has(sanitizedNumber)) {
        const creationTime = socketCreationTime.get(sanitizedNumber);
        const uptime = creationTime ? Math.floor((Date.now() - creationTime) / 1000) : 0;
        return res.status(200).json({
            status: 'already_connected',
            message: 'This number is already connected',
            connectionTime: creationTime ? new Date(creationTime).toLocaleString() : null,
            uptime: formatUptime(uptime)
        });
    }

    await startBot(sanitizedNumber, res);
});

router.get('/active', (req, res) => {
    const sessions = [];
    for (const [number, socket] of activeSockets) {
        const creationTime = socketCreationTime.get(number);
        sessions.push({
            number: number,
            connected: true,
            since: creationTime ? new Date(creationTime).toLocaleString() : null,
            uptime: creationTime ? formatUptime(Math.floor((Date.now() - creationTime) / 1000)) : null
        });
    }
    res.status(200).json({
        count: activeSockets.size,
        sessions: sessions
    });
});

router.get('/ping', (req, res) => {
    res.status(200).json({
        status: 'active',
        message: '🐢 SILA MD MINI BOT 🐢',
        activeSessions: activeSockets.size,
        commandsLoaded: plugins.size,
        database: 'MongoDB Connected',
        uptime: formatUptime(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

router.get('/connect-all', async (req, res) => {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        
        if (numbers.length === 0) {
            return res.status(404).json({ error: 'No numbers found to connect' });
        }

        const results = [];
        for (const number of numbers) {
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes, json: () => {} };
            await startBot(number, mockRes);
            results.push({ number, status: 'connection_initiated' });
            await delay(1000);
        }

        res.status(200).json({
            status: 'success',
            total: numbers.length,
            connections: results
        });
    } catch (error) {
        console.error('Connect all error:', error);
        res.status(500).json({ error: 'Failed to connect all bots' });
    }
});

// ==================== CLEANUP ====================

process.on('exit', () => {
    console.log('🛑 Shutting down... Closing all connections');
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught exception:', err);
    if (process.env.PM2_NAME) {
        exec(`pm2 restart ${process.env.PM2_NAME}`);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start auto-reconnect
setTimeout(() => {
    autoReconnectFromMongoDB();
}, 5000);

console.log('\n╔════════════════════════════════════════╗');
console.log('║     🐢 SILA MD BOT STARTED 🐢        ║');
console.log('║                                      ║');
console.log(`║   📦 Commands Loaded: ${plugins.size}              ║`);
console.log(`║   🔧 Prefix: ${defaultConfig.PREFIX}                 ║`);
console.log(`║   👥 Group: ${defaultConfig.GROUP_INVITE_LINK} ║`);
console.log(`║   📢 Channel: ${defaultConfig.CHANNEL_LINK} ║`);
console.log('╚════════════════════════════════════════╝\n');

module.exports = router;
