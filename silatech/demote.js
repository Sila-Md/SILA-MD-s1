// silatech/demote.js
cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    react: "🔻",
    desc: "Demote an admin to normal member",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🔻", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) {
        return await conn.sendMessage(from, { text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚒𝚗𝚏𝚘` });
    }

    const participants = metadata.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚘𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let number;
    if (quoted) {
        number = quoted.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, "");
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        number = mek.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0];
    }

    if (!number) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚍𝚎𝚖𝚘𝚝𝚎 @𝚊𝚍𝚖𝚒𝚗*
*┃🐢│ • 💬 𝚘𝚛 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚎𝚒𝚛 𝚖𝚎𝚜𝚜𝚊𝚐𝚎*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const jid = number + "@s.whatsapp.net";
    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const botJidNumber = botJid.split("@")[0];

    if (number === botJidNumber) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚢𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚍𝚎𝚖𝚘𝚝𝚎 𝚝𝚑𝚎 𝚋𝚘𝚝

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!groupAdmins.includes(jid)) {
        return await conn.sendMessage(from, {
            text: `⚠️ @${number} 𝚒𝚜 𝚗𝚘𝚝 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        await conn.sendMessage(from, {
            text: `✅ @${number} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚎𝚖𝚘𝚝𝚎𝚍 𝚏𝚛𝚘𝚖 𝚊𝚍𝚖𝚒𝚗

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        console.error("Demote Error:", error);
        await conn.sendMessage(from, { text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚎𝚖𝚘𝚝𝚎 𝚞𝚜𝚎𝚛` });
    }
});
