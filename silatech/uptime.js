// silatech/uptime.js
cmd({
    pattern: "uptime",
    alias: ['up'],
    react: "⏱️",
    desc: "Show bot uptime",
    category: "general",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
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
    
    const botNumberFormatted = botNumber || conn.user?.id?.split('@')[0] || 'Unknown';
    
    const msgText = `*╭━━〔 🐢 𝚄𝙿𝚃𝙸𝙼𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptimeString}*
*┃🐢│ • 💾 𝙼𝙴𝙼𝙾𝚁𝚈: ${heapUsed}𝙼𝙱 / ${heapTotal}𝙼𝙱*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        text: msgText,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
