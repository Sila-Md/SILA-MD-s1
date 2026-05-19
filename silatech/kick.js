// silatech/kick.js
cmd({
    pattern: "kick",
    alias: ["remove", "delete"],
    react: "👢",
    desc: "Remove a user from the group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.participant || mek.key.remoteJid;
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
    const groupAdmins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const isBotAdmins = groupAdmins.includes(conn.user.id);
    const q = args.join(" ");

    // 👢 react on command
    await conn.sendMessage(from, { react: { text: "👢", key: mek.key } });

    // ⚠️ Group check
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `❌ this command can only be used in groups`
        });
    }

    // 🤖 Bot admin check
    if (!isBotAdmins) {
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `❌ please make me admin first`
        });
    }

    // 🧩 Number detection
    let user;
    if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quotedMsg = mek.message.extendedTextMessage.contextInfo;
        if (quotedMsg.participant) {
            user = quotedMsg.participant;
        }
    } else if (q && q.includes("@")) {
        user = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        user = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!user) {
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙺𝙸𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • ⚠️ please tag the user or reply*
*┃🐢│ • ✍️ to their message*
*┃🐢│ • 📝 example: .kick @user*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    // Don't allow kicking bot
    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (user === botJid) {
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        return await conn.sendMessage(from, {
            text: `❌ sorry, you can't kick me`
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [user], "remove");

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙺𝙸𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 👢 @${user.split('@')[0]} has been*
*┃🐢│ • 🚫 removed from the group*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [user]
        });

    } catch (error) {
        console.error("❌ KICK ERROR:", error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await conn.sendMessage(from, {
            text: `❌ failed to kick user. please try again.`
        });
    }
});
