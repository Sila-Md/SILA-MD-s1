// silatech/promote.js
cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "admin"],
    react: "👑",
    desc: "Promote a member to group admin",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎:
https://sila-mini.silatech.site/pair
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

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎:
https://sila-mini.silatech.site/pair
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
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚙𝚛𝚘𝚖𝚘𝚝𝚎 @𝚞𝚜𝚎𝚛*
*┃🐢│ • 💬 𝚘𝚛 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚎𝚒𝚛 𝚖𝚎𝚜𝚜𝚊𝚐𝚎*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: 
https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const jid = number + "@s.whatsapp.net";

    if (groupAdmins.includes(jid)) {
        return await conn.sendMessage(from, {
            text: `⚠️ @${number} 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: 
https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        await conn.sendMessage(from, {
            text: `✅ @${number} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚙𝚛𝚘𝚖𝚘𝚝𝚎𝚍 𝚝𝚘 𝚊𝚍𝚖𝚒𝚗

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: 
https://sila-mini.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        console.error("Promote Error:", error);
        await conn.sendMessage(from, { text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚙𝚛𝚘𝚖𝚘𝚝𝚎 𝚞𝚜𝚎𝚛` });
    }
});
