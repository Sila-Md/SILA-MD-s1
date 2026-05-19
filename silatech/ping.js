// silatech/ping.js
cmd({
    pattern: "ping",
    alias: ["pong", "latency"],
    react: "🏓",
    desc: "Check bot response time",
    category: "general",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    const sentMsg = await conn.sendMessage(from, { 
        text: '*_⚡️ 𝙿𝙸𝙽𝙶𝙸𝙽𝙶 𝚃𝙾 𝚂𝙴𝚁𝚅𝙴𝚁..._*',
        contextInfo: conn.forwardContext
    }, { quoted: conn.fkontak });
    
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endTime = Date.now();
    const ping = endTime - startTime;
    
    const pingMsg = `*╭━━〔 🐢 𝙿𝙸𝙽𝙶 🐢 〕━━┈⊷*
*┃🐢│ • 🏓 𝙿𝙾𝙽𝙶!*
*┃🐢│ • ⚡ 𝙻𝙰𝚃𝙴𝙽𝙲𝚈: ${ping}𝚖𝚜*
*┃🐢│ • 🤖 𝙱𝙾𝚃: 𝚂𝙸𝙻𝙰 𝙼𝙸𝙽𝙸*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    
    await conn.sendMessage(from, { 
        text: pingMsg,
        edit: sentMsg.key
    });
});
