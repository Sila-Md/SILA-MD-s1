// silatech/dot.js
cmd({
    pattern: ".",
    alias: ["bot", "info", "about"],
    react: "🤖",
    desc: "bot information",
    category: "main",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    await conn.sendMessage(from, { react: { text: "🤖", key: mek.key } });
    
    try {
        const response = `*╭━━〔 🐢 𝚂𝙸𝙻𝙰 𝚃𝙴𝙲𝙷 🐢 〕━━┈⊷*
*┃🐢│ • 🤖 bot link: minibot.silatech.site*
*┃🐢│ • 🛒 website: store.silatech.site*
*┃🐢│ • 📢 channel: https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02*
*┃🐢│ • 👑 owner: +255789661031*
*┃🐢│ • 💡 commands: type .menu for commands*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            text: response,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Error in dot command:', error);
        await conn.sendMessage(from, {
            text: `❌ error displaying bot info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});