// silatech/setautoview.js
cmd({
    pattern: "setautoview",
    alias: ["autoview", "viewstatus"],
    react: "👁️",
    desc: "Enable/disable auto view status",
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
            text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙰𝚄𝚃𝙾𝚅𝙸𝙴𝚆 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚜𝚎𝚝𝚊𝚞𝚝𝚘𝚟𝚒𝚎𝚠 𝚘𝚗/𝚘𝚏𝚏*
*┃🐢│ • 📝 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: .𝚜𝚎𝚝𝚊𝚞𝚝𝚘𝚟𝚒𝚎𝚠 𝚘𝚗*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    global.botConfig = global.botConfig || {};
    global.botConfig.AUTO_VIEW_STATUS = option === 'on';
    
    await conn.sendMessage(from, {
        text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙰𝚄𝚃𝙾𝚅𝙸𝙴𝚆 🐢 〕━━┈⊷*
*┃🐢│ • ✅ 𝚊𝚞𝚝𝚘 𝚟𝚒𝚎𝚠 𝚜𝚝𝚊𝚝𝚞𝚜 𝚝𝚞𝚛𝚗𝚎𝚍 ${option === 'on' ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
        contextInfo: conn.forwardContext
    });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});
