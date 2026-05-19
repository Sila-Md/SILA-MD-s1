// silatech/setautobio.js
cmd({
    pattern: "setautobio",
    alias: ["autobio", "bioauto"],
    react: "📝",
    desc: "Enable/disable auto bio update",
    category: "admin",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const fromMe = mek.key.fromMe;
    const option = args[0]?.toLowerCase();

    if (!fromMe) {
        return await conn.sendMessage(from, {
            text: `🔒 owner only command

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!option || (option !== 'on' && option !== 'off')) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙰𝚄𝚃𝙾𝙱𝙸𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚜𝚎𝚝𝚊𝚞𝚝𝚘𝚋𝚒𝚘 𝚘𝚗/𝚘𝚏𝚏*
*┃🐢│ • 📝 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: .𝚜𝚎𝚝𝚊𝚞𝚝𝚘𝚋𝚒𝚘 𝚘𝚗*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    global.botConfig = global.botConfig || {};
    global.botConfig.AUTO_BIO = option === 'on';
    
    await conn.sendMessage(from, {
        text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙰𝚄𝚃𝙾𝙱𝙸𝙾 🐢 〕━━┈⊷*
*┃🐢│ • ✅ 𝚊𝚞𝚝𝚘 𝚋𝚒𝚘 𝚞𝚙𝚍𝚊𝚝𝚎 𝚝𝚞𝚛𝚗𝚎𝚍 ${option === 'on' ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
        contextInfo: conn.forwardContext
    });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});
