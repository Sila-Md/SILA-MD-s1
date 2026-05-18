// plugins/system.js
const defaultConfig = {
    RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/C0CWyj7RapP2vX7vNdUSTK',
    OWNER_NUMBER: '255612491554',
    PREFIX: '.'
};

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}𝚍 ${hours}𝚑 ${minutes}𝚖 ${secs}𝚜`;
    if (hours > 0) return `${hours}𝚑 ${minutes}𝚖 ${secs}𝚜`;
    if (minutes > 0) return `${minutes}𝚖 ${secs}𝚜`;
    return `${secs}𝚜`;
}

// ==================== UPTIME COMMAND ====================
module.exports = {
    command: 'uptime',
    alias: [],
    react: '⏱️',
    desc: 'Show bot uptime',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const memoryUsage = process.memoryUsage();
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        const now = new Date();
        const timeString = now.toLocaleString();
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        
        const uptimeMsg = `*╭━━〔 🐢 𝚄𝙿𝚃𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙼𝙴𝙼𝙾𝚁𝚈: ${heapUsed}𝙼𝙱 / ${heapTotal}𝙼𝙱*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${timeString}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            text: uptimeMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// ==================== RUNTIME COMMAND ====================
const runtimeCmd = {
    command: 'runtime',
    alias: ['run'],
    react: '⚡',
    desc: 'Show bot runtime',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const memoryUsage = process.memoryUsage();
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        
        const runtimeMsg = `*╭━━〔 🐢 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⚡ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙼𝙴𝙼𝙾𝚁𝚈: ${heapUsed}𝙼𝙱*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            text: runtimeMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// ==================== ALIVE COMMAND (with image) ====================
const aliveCmd = {
    command: 'alive',
    alias: ['alivem'],
    react: '💚',
    desc: 'Check if bot is alive',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        
        const aliveMsg = `*╭━━〔 🐢 𝙰𝙻𝙸𝚅𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙰𝙲𝚃𝙸𝚅𝙴*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: aliveMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// ==================== STATUS COMMAND (with image) ====================
const statusCmd = {
    command: 'status',
    alias: ['botstatus'],
    react: '📊',
    desc: 'Show bot status',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const memoryUsage = process.memoryUsage();
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        const commandsLoaded = global.commandsCount || 0;
        
        const statusMsg = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • ✅ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙽𝙻𝙸𝙽𝙴*
*┃🐢│ • ⏱️ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙼𝙴𝙼𝙾𝚁𝚈: ${heapUsed}/${heapTotal} 𝙼𝙱*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 📦 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂: ${commandsLoaded}*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: statusMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// ==================== STATS COMMAND (with image) ====================
const statsCmd = {
    command: 'stats',
    alias: ['statistics', 'botstats'],
    react: '📈',
    desc: 'Show bot statistics',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const memoryUsage = process.memoryUsage();
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
        
        const cpuUsage = process.cpuUsage();
        const cpuUser = (cpuUsage.user / 1000000).toFixed(2);
        const cpuSystem = (cpuUsage.system / 1000000).toFixed(2);
        
        const platform = process.platform;
        const nodeVersion = process.version;
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        const commandsLoaded = global.commandsCount || 0;
        
        const statsMsg = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📊 𝚃𝙾𝚃𝙰𝙻 𝙲𝙼𝙳𝚂: ${commandsLoaded}*
*┃🐢│ • ⏱️ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝚁𝚂𝚂: ${rss} 𝙼𝙱*
*┃🐢│ • 💾 𝙷𝙴𝙰𝙿: ${heapUsed}/${heapTotal} 𝙼𝙱*
*┃🐢│ • 💻 𝙲𝙿𝚄 𝚄𝚂𝙴𝚁: ${cpuUser}𝚜*
*┃🐢│ • 💻 𝙲𝙿𝚄 𝚂𝚈𝚂: ${cpuSystem}𝚜*
*┃🐢│ • 🖥️ 𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼: ${platform}*
*┃🐢│ • 🔧 𝙽𝙾𝙳𝙴: ${nodeVersion}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: statsMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// ==================== INFO COMMAND (with image) ====================
const infoCmd = {
    command: 'info',
    alias: ['about', 'botinfo'],
    react: 'ℹ️',
    desc: 'Show bot information',
    category: 'system',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        const uptimeString = formatUptime(uptime);
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        const commandsLoaded = global.commandsCount || 0;
        
        const infoMsg = `*╭━━〔 🐢 𝙸𝙽𝙵𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 📝 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: 2.0.0*
*┃🐢│ • 👑 𝙾𝚆𝙽𝙴𝚁: wa.me/${defaultConfig.OWNER_NUMBER}*
*┃🐢│ • 📦 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂: ${commandsLoaded}*
*┃🐢│ • ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*┃🐢│ • 🔗 𝙲𝙷𝙰𝙽𝙽𝙴𝙻: ${defaultConfig.CHANNEL_LINK}*
*┃🐢│ • 👥 𝙶𝚁𝙾𝚄𝙿: ${defaultConfig.GROUP_INVITE_LINK}*
*╰━━━━━━━━━━━━━━━┈⊷*

*🔧 𝙵𝙴𝙰𝚃𝚄𝚁𝙴𝚂*
┌─────────────────────┈⊷
│ ✅ 𝙰𝚞𝚝𝚘 𝚅𝚒𝚎𝚠 𝚂𝚝𝚊𝚝𝚞𝚜
│ ✅ 𝙰𝚞𝚝𝚘 𝙻𝚒𝚔𝚎 𝚂𝚝𝚊𝚝𝚞𝚜
│ ✅ 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔
│ ✅ 𝙽𝚎𝚠𝚜𝚕𝚎𝚝𝚝𝚎𝚛
│ ✅ 𝙵𝚘𝚛𝚠𝚊𝚛𝚍 
└─────────────────────┈⊷

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, {
            react: { text: this.react, key: msg.key }
        });
        
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: infoMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};

// Register all commands
module.exports = [
    module.exports,
    runtimeCmd,
    aliveCmd,
    statusCmd,
    statsCmd,
    infoCmd
];
