// plugins/stats.js
module.exports = {
    command: 'stats',
    alias: ['statistics', 'botstats'],
    react: '📈',
    desc: 'Show bot statistics',
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        let uptimeString = '';
        if (days > 0) uptimeString += `${days}𝚍 `;
        if (hours > 0) uptimeString += `${hours}𝚑 `;
        if (minutes > 0) uptimeString += `${minutes}𝚖 `;
        uptimeString += `${seconds}𝚜`;
        
        const memoryUsage = process.memoryUsage();
        const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
        
        const cpuCores = require('os').cpus().length;
        const platform = require('os').platform();
        
        const defaultConfig = {
            RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
        };
        
        const statsMsg = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 📊 𝚃𝙾𝚃𝙰𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂: ${global.plugins?.size || 0}*
*┃🐢│ • ⏱️ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙷𝙴𝙰𝙿: ${heapUsed}𝙼𝙱 / ${heapTotal}𝙼𝙱*
*┃🐢│ • 🖥️ 𝚁𝚂𝚂: ${rss}𝙼𝙱*
*┃🐢│ • 🧠 𝙲𝙿𝚄 𝙲𝙾𝚁𝙴𝚂: ${cpuCores}*
*┃🐢│ • 💻 𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼: ${platform}*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, { react: { text: this.react, key: msg.key } });
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: statsMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};
