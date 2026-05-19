// silatech/pair.js
const axios = require("axios");

// Bot website URL
const BOT_URL = 'https://sila-mini.silatech.site/pair';

cmd({
    pattern: "pair",
    alias: ["pairing", "code", "getcode"],
    react: "🔐",
    desc: "Get pairing code for SILA MINI bot",
    category: "tools",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || mek.key.remoteJid;
    const phoneNumber = args.join(" ").trim();

    // React first
    await conn.sendMessage(from, { react: { text: "🔐", key: mek.key } });

    if (!phoneNumber) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝙰𝙸𝚁 𝙲𝙾𝙳𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 🔐 to get pairing code*
*┃🐢│ • 📝 type: .pair 255612491554*
*┃🐢│ • 🌐 or visit: ${BOT_URL}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Validate phone number
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝙰𝙸𝚁 𝙲𝙾𝙳𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ invalid phone number*
*┃🐢│ • 📝 example: .pair 255612491554*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        const apiUrl = `https://sila-mini.silatech.site/code?number=${cleanNumber}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data || !response.data.code) {
            return await conn.sendMessage(from, {
                text: `*╭━━〔 🐢 𝙿𝙰𝙸𝚁 𝙲𝙾𝙳𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ failed to get pairing code*
*┃🐢│ • 🔄 please try again later*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
                contextInfo: conn.forwardContext
            });
        }

        const pairingCode = response.data.code;

        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝙰𝙸𝚁 𝙲𝙾𝙳𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ your pairing code for +${cleanNumber}*
*┃🐢│ • 🔐 code: ${pairingCode}*
*┃🐢│ • ⏰ expires in 5 minutes*
*┃🐢│ • 🌐 or visit: ${BOT_URL}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

        // Also send just the code separately
        await conn.sendMessage(from, { text: `${pairingCode}` });
        
        // Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        // Error without box style - plain text only
        await conn.sendMessage(from, { 
            text: `❌ failed to get pairing code! please try again later.`
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
