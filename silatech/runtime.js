// silatech/runtime.js
cmd({
    pattern: "runtime",
    alias: ['run'],
    react: "⏰",
    desc: "Show bot runtime",
    category: "general",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
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
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        text: msgText,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
