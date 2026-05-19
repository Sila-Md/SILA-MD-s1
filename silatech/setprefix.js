// silatech/setprefix.js
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "setprefix",
    alias: ["prefix", "changeprefix"],
    react: "⚙️",
    desc: "Change bot prefix",
    category: "admin",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const fromMe = mek.key.fromMe;
    const newPrefix = args[0];

    if (!fromMe) {
        return await conn.sendMessage(from, {
            text: `🔒 owner only command

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!newPrefix) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙿𝚁𝙴𝙵𝙸𝚇 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚜𝚎𝚝𝚙𝚛𝚎𝚏𝚒𝚡 <𝚜𝚢𝚖𝚋𝚘𝚕>*
*┃🐢│ • 📝 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: .𝚜𝚎𝚝𝚙𝚛𝚎𝚏𝚒𝚡 !*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Save prefix to global config
    global.botConfig = global.botConfig || {};
    global.botConfig.PREFIX = newPrefix;
    
    // Also save to file
    const configPath = path.join(__dirname, '../config.json');
    let config = {};
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    config.PREFIX = newPrefix;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await conn.sendMessage(from, {
        text: `*╭━━〔 🐢 𝚂𝙴𝚃𝙿𝚁𝙴𝙵𝙸𝚇 🐢 〕━━┈⊷*
*┃🐢│ • ✅ 𝚙𝚛𝚎𝚏𝚒𝚡 𝚌𝚑𝚊𝚗𝚐𝚎𝚍 𝚝𝚘: ${newPrefix}*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
        contextInfo: conn.forwardContext
    });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});
