// silatech/add.js
cmd({
    pattern: "add",
    alias: ["invite", "join"],
    react: "➕",
    desc: "Add a member to the group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "➕", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) {
        return await conn.sendMessage(from, { text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚐𝚛𝚘𝚞𝚙 𝚒𝚗𝚏𝚘` });
    }

    const groupAdmins = metadata.participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ 𝚘𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!q) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙳𝙳 🐢 〕━━┈⊷*
*┃🐢│ • 📝 𝚞𝚜𝚊𝚐𝚎: .𝚊𝚍𝚍 <𝚗𝚞𝚖𝚋𝚎𝚛>*
*┃🐢│ • 📝 𝚎𝚡𝚊𝚖𝚙𝚕𝚎: .𝚊𝚍𝚍 𝟸𝟻𝟻𝟼𝟷𝟸𝟺𝟿𝟷𝟻𝟻𝟺*
*╰━━━━━━━━━━━━━━━┈⊷*
𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let number = q.replace(/[^0-9]/g, "");
    if (number.length < 10) {
        return await conn.sendMessage(from, { text: `❌ 𝚒𝚗𝚟𝚊𝚕𝚒𝚍 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛` });
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        await conn.sendMessage(from, {
            text: `✅ +${number} 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚊𝚍𝚍𝚎𝚍 𝚝𝚘 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        console.error("Add Error:", error);
        await conn.sendMessage(from, { text: `❌ 𝚏𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚊𝚍𝚍 𝚞𝚜𝚎𝚛. 𝚖𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚝𝚑𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚒𝚜 𝚛𝚎𝚐𝚒𝚜𝚝𝚎𝚛𝚎𝚍 𝚘𝚗 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙` });
    }
});
