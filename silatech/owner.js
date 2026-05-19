// silatech/owner.js
cmd({
    pattern: "owner",
    alias: ["creator", "botowner", "sila"],
    react: "👑",
    desc: "Send the bot owner's WhatsApp contact",
    category: "info",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;

    try {
        // 🔍 Bot ka apna WhatsApp JID lo
        const botJid = conn.user.id;
        const botNumberFormatted = botNumber || botJid.split("@")[0];

        // 🪪 vcard with owner number
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:SILA MINI OWNER
TEL;type=CELL;type=VOICE;waid=${botNumberFormatted}:+${botNumberFormatted}
END:VCARD`.trim();

        // 📤 Send the contact card with box style
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙾𝚆𝙽𝙴𝚁 🐢 〕━━┈⊷*
*┃🐢│ • 👑 scan this contact to chat with owner*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });

        await conn.sendMessage(from, {
            contacts: {
                displayName: "SILA MINI OWNER",
                contacts: [{ vcard }]
            }
        });

        // React success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("❌ owner command error:", err);
        // Error without box style - plain text only
        await conn.sendMessage(from, { 
            text: `❌ error sending owner contact! please try again.`
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
