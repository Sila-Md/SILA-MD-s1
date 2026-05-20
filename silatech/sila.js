// silatech/sila.js
cmd({
    pattern: "sila",
    alias: ["dev", "creator", "bot"],
    react: "👑",
    desc: "bot developer information",
    category: "main",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    
    await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });
    
    try {
        const caption = `*╭━━〔 🐢 𝚂𝙸𝙻𝙰 𝚃𝙴𝙲𝙷 🐢 〕━━┈⊷*
*┃🐢│ • 👤 𝚗𝚊𝚖𝚎: 𝚂𝙸𝙻𝙰 𝚃𝙴𝙲𝙷*
*┃🐢│ • 🎯 𝚛𝚘𝚕𝚎: 𝙱𝚘𝚝 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 & 𝙾𝚠𝚗𝚎𝚛*
*┃🐢│ • 💻 𝚜𝚙𝚎𝚌𝚒𝚊𝚕𝚒𝚝𝚢: 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚖𝚎𝚗𝚝*
*┃🐢│ • 🌟 𝚎𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎: 𝟹+ 𝚈𝚎𝚊𝚛𝚜*
*╰━━━━━━━━━━━━━━━┈⊷*

*📞 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙸𝙽𝙵𝙾*
*┌─────────────────────┈⊷*
*│ 📱 𝚙𝚑𝚘𝚗𝚎: +255789661031*
*│ 📧 𝚎𝚖𝚊𝚒𝚕: silatech.dev@gmail.com*
*└─────────────────────┈⊷*

*🔧 𝚂𝙴𝚁𝚅𝙸𝙲𝙴𝚂 𝙾𝙵𝙵𝙴𝚁𝙴𝙳*
*┌─────────────────────┈⊷*
*│ 🤖 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚖𝚎𝚗𝚝*
*│ 💾 𝙱𝚘𝚝 𝙷𝚘𝚜𝚝𝚒𝚗𝚐 & 𝙼𝚊𝚒𝚗𝚝𝚎𝚗𝚊𝚗𝚌𝚎*
*│ 🔧 𝙱𝚘𝚝 𝚄𝚙𝚍𝚊𝚝𝚎𝚜 & 𝙵𝚒𝚡𝚎𝚜*
*│ 📚 𝙲𝚞𝚜𝚝𝚘𝚖 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜*
*└─────────────────────┈⊷*

*🌐 𝙻𝙸𝙽𝙺𝚂*
*┌─────────────────────┈⊷*
*│ 📢 𝙲𝚑𝚊𝚗𝚗𝚎𝚕: https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02*
*│ 🛒 𝚆𝚎𝚋𝚜𝚒𝚝𝚎: store.silatech.site*
*└─────────────────────┈⊷*

*𝙵𝙴𝙴𝙻 𝙵𝚁𝙴𝙴 𝚃𝙾 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙼𝙴 𝙵𝙾𝚁*
*┌─────────────────────┈⊷*
*│ • 𝙱𝚘𝚝 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚖𝚎𝚗𝚝*
*│ • 𝙱𝚘𝚝 𝙼𝚘𝚍𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗𝚜*
*│ • 𝙲𝚞𝚜𝚝𝚘𝚖 𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜*
*│ • 𝚃𝚎𝚌𝚑𝚗𝚒𝚌𝚊𝚕 𝚂𝚞𝚙𝚙𝚘𝚛𝚝*
*└─────────────────────┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/dlvrav.jpg" },
            caption: caption,
            contextInfo: conn.forwardContext
        });
        
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Error in sila command:', error);
        await conn.sendMessage(from, {
            text: `❌ error displaying developer info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});