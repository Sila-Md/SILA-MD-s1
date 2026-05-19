// silatech/jid.js
cmd({
    pattern: "jid",
    alias: ["getjid", "id", "jidinfo"],
    react: "🆔",
    desc: "Get WhatsApp JID information",
    category: "utility",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || from;
    const pushname = mek.pushName || "User";

    let targetJid;
    let targetName;
    let targetType;

    try {
        // Determine target based on context
        if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            // If user is mentioned
            targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            targetName = "mentioned user";
            targetType = "user";
        } else if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
            // If replying to a message
            targetJid = mek.message.extendedTextMessage.contextInfo.participant;
            targetName = "quoted user";
            targetType = "user";
        } else if (from.endsWith('@g.us')) {
            // If in group - get group info
            const metadata = await conn.groupMetadata(from);
            targetJid = from;
            targetName = metadata.subject || "group";
            targetType = "group";
        } else if (from.endsWith('@newsletter')) {
            // If in channel
            targetJid = from;
            targetName = "channel";
            targetType = "channel";
        } else {
            // Default to own JID
            targetJid = sender;
            targetName = pushname;
            targetType = "user";
        }

        // Format JID information
        const caption = `*╭━━〔 🐢 𝙹𝙸𝙳 𝙸𝙽𝙵𝙾 🐢 〕━━┈⊷*
*┃🐢│ • 🆔 jid: ${targetJid}*
*┃🐢│ • 📛 name: ${targetName}*
*┃🐢│ • 📋 type: ${targetType}*
*┃🐢│ • 👤 requested by: ${pushname}*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/90i7j4.png" },
            caption: caption,
            contextInfo: conn.forwardContext,
            mentions: [targetJid]
        });

        // React success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("JID Command Error:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        
        const errorMsg = `*╭━━〔 🐢 𝙹𝙸𝙳 𝙸𝙽𝙵𝙾 🐢 〕━━┈⊷*
*┃🐢│ • ❌ error: ${error.message}*
*┃🐢│ • 💡 please try again*
*┃🐢│ • 🔄 make sure you're replying to a valid message*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

        await conn.sendMessage(from, {
            text: errorMsg,
            contextInfo: conn.forwardContext
        });
    }
});
