// silatech/tagall.js
cmd({
    pattern: "tagall",
    alias: ["everyone", "all", "mentionall"],
    react: "📢",
    desc: "Tag everyone in the group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `❌ this command can only be used in groups`
        });
    }

    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info`
        });
    }

    const participants = metadata.participants.map(p => p.id);
    const groupName = metadata.subject || "group";
    const adminCount = metadata.participants.filter(p => p.admin).length;
    const user = mek.pushName || "user";
    const memberCount = participants.length;

    // List of emojis for mentions
    const emojis = ["🌺", "🌹", "🌟", "🌝", "🍒", "🍥", "🍷"];
    
    // Create mentions with alternating emojis (all inside box)
    let mentionsText = "";
    for (let i = 0; i < participants.length; i++) {
        const emoji = emojis[i % emojis.length];
        mentionsText += `*┃🐢│ ${emoji} @${participants[i].split("@")[0]}\n`;
    }

    const caption = `*╭━━〔 🐢 𝚃𝙰𝙶 𝙰𝙻𝙻 🐢 〕━━┈⊷*
*┃🐢│ • 🏷️ group: ${groupName}*
*┃🐢│ • 👑 admins: ${adminCount}*
*┃🐢│ • 👤 user: ${user}*
*┃🐢│ • 👥 members: ${memberCount}*
*╰━━━━━━━━━━━━━━━┈⊷*

*┌─────────────────────┈⊷*
${mentionsText}*└─────────────────────┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/90i7j4.png" },
        caption: caption,
        contextInfo: conn.forwardContext,
        mentions: participants
    });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});
