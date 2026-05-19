// plugins/status.js
module.exports = {
    command: 'status',
    alias: ['botstatus'],
    react: '📊',
    desc: 'Show bot status',
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
        
        const defaultConfig = {
            RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg',
            PREFIX: '.'
        };
        
        const botNumberFormatted = botNumber || socket.user?.id?.split('@')[0] || 'Unknown';
        
        const statusMsg = `*╭━━〔 🐢 𝚂𝚃𝙰𝚃𝚄𝚂 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • ✅ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙾𝙽𝙻𝙸𝙽𝙴*
*┃🐢│ • ⏱️ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙼𝙴𝙼𝙾𝚁𝚈: ${heapUsed}𝙼𝙱*
*┃🐢│ • 🔧 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂: ${global.plugins?.size || 0}*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*╰━━━━━━━━━━━━━━━┈⊷*

> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, { react: { text: this.react, key: msg.key } });
        await socket.sendMessage(from, { 
            image: { url: defaultConfig.RCD_IMAGE_PATH },
            caption: statusMsg,
            contextInfo: socket.forwardContext
        }, { quoted: msg });
    }
};
