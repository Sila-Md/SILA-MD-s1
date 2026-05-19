// silatech/getconfig.js
cmd({
    pattern: "getconfig",
    alias: ["config", "settings", "botconfig"],
    react: "⚙️",
    desc: "View current bot configuration",
    category: "admin",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const fromMe = mek.key.fromMe;

    if (!fromMe) {
        return await conn.sendMessage(from, {
            text: `🔒 owner only command

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const config = global.botConfig || {};
    
    const configText = `*╭━━〔 🐢 𝙲𝙾𝙽𝙵𝙸𝙶 🐢 〕━━┈⊷*
*┃🐢│ • 🔧 𝙿𝚁𝙴𝙵𝙸𝚇: ${config.PREFIX || '.'}*
*┃🐢│ • 👁️ 𝙰𝚄𝚃𝙾 𝚅𝙸𝙴𝚆: ${config.AUTO_VIEW_STATUS !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*┃🐢│ • ❤️ 𝙰𝚄𝚃𝙾 𝙻𝙸𝙺𝙴: ${config.AUTO_LIKE_STATUS !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*┃🐢│ • 🛡️ 𝙰𝙽𝚃𝙸 𝙻𝙸𝙽𝙺: ${config.ANTI_LINK !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*┃🐢│ • 🎉 𝚆𝙴𝙻𝙲𝙾𝙼𝙴: ${config.WELCOME !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*┃🐢│ • 📞 𝙰𝙽𝚃𝙸 𝙲𝙰𝙻𝙻: ${config.ANTI_CALL !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*┃🐢│ • 📝 𝙰𝚄𝚃𝙾 𝙱𝙸𝙾: ${config.AUTO_BIO !== false ? '𝙾𝙽' : '𝙾𝙵𝙵'}*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    await conn.sendMessage(from, {
        text: configText,
        contextInfo: conn.forwardContext
    });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});
