// silatech/promote.js
cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "admin"],
    react: "🥺",
    desc: "Promotes a member to group admin",
    category: "admin",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const q = args.join(" ");

    // 🥺 react on command
    await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

    // ❌ Not group
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "😫", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ this command can only be used in groups*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Fetch group metadata
    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info`
        });
    }

    const participants = metadata.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isBotAdmins = groupAdmins.includes(botJid);
    const isAdmins = groupAdmins.includes(sender);

    // ❌ User not admin
    if (!isAdmins) {
        await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ only group admins can use this*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // ❌ Bot not admin
    if (!isBotAdmins) {
        await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ❌ please make me admin first*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // 🎯 Determine target user
    let number;
    if (quoted) {
        number = quoted.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, "");
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        number = mek.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0];
    }

    if (!number) {
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 👤 which member to promote?*
*┃🐢│ • 📝 .promote @user*
*┃🐢│ • 💬 or reply to their message*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const jid = number + "@s.whatsapp.net";

    // 🧩 Skip if already admin
    if (groupAdmins.includes(jid)) {
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ⚠️ @${number} is already an admin*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
    }

    try {
        // ✅ Promote member
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ @${number} has been promoted*
*┃🐢│ • 👑 from member to admin*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });

    } catch (error) {
        console.error("Promote Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        // Error without box style - plain text only
        await conn.sendMessage(from, { 
            text: `❌ failed to promote user. please try again.`
        });
    }
});
