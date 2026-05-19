// plugins/runtime.js
module.exports = {
    command: 'runtime',
    alias: ['run'],
    react: '⏰',
    desc: 'Show bot runtime',
    category: 'utility',
    async execute(socket, msg, args, botNumber) {
        const from = msg.key.remoteJid;
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        let runtimeString = '';
        if (days > 0) runtimeString += `${days}𝚍 `;
        if (hours > 0) runtimeString += `${hours}𝚑 `;
        if (minutes > 0) runtimeString += `${minutes}𝚖 `;
        runtimeString += `${seconds}𝚜`;
        
        const msgText = `*╭━━〔 🐢 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⏰ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${runtimeString}*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 🕐 𝚃𝙸𝙼𝙴: ${new Date().toLocaleString()}*
*╰━━━━━━━━━━━━━━━┈⊷*
> 🐢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 𝚂𝚒𝚕𝚊`;

        await socket.sendMessage(from, { react: { text: this.react, key: msg.key } });
        await socket.sendMessage(from, { text: msgText, contextInfo: socket.forwardContext }, { quoted: msg });
    }
};
