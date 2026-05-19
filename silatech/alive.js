// silatech/alive.js
cmd({
    pattern: "alive",
    alias: ["online"],
    react: "💫",
    desc: "Check if bot is active",
    category: "general",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const defaultConfig = {
        PREFIX: '.',
        RCD_IMAGE_PATH: 'https://i.ibb.co/4RM2GC9F/Sila-mini.jpg'
    };
    
    const botNumberFormatted = botNumber || conn.user?.id?.split('@')[0] || 'Unknown';
    
    const aliveMsg = `*╭━━〔 🐢 𝙰𝙻𝙸𝚅𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*┃🐢│ • ✅ 𝚂𝚃𝙰𝚃𝚄𝚂: 𝙰𝙲𝚃𝙸𝚅𝙴*
*┃🐢│ • 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${defaultConfig.PREFIX}*
*┃🐢│ • ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${hours}𝚑 ${minutes}𝚖 ${seconds}𝚜*
*┃🐢│ • 📱 𝙽𝚄𝙼𝙱𝙴𝚁: +${botNumberFormatted}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        image: { url: defaultConfig.RCD_IMAGE_PATH },
        caption: aliveMsg,
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
});
