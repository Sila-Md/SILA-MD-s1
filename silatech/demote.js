// silatech/demote.js
cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin", "dmt"],
    react: "🥺",
    desc: "Demotes a group admin to a normal member",
    category: "admin",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.participant || mek.key.remoteJid;
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
    const groupAdmins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const isAdmins = groupAdmins.includes(sender);
    const isBotAdmins = groupAdmins.includes(conn.user.id);
    const q = args.join(" ");

    // 🥺 react on command start
    await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

    // ⚠️ Group check
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "😫", key: mek.key } });
        return await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❌ 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙲𝙰𝙽 𝙾𝙽𝙻𝚈 𝙱𝙴*
*┃🐢│ 𝚄𝚂𝙴𝙳 𝙸𝙽 𝙶𝚁𝙾𝚄𝙿𝚂*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }

    // 👮 User admin check
    if (!isAdmins) {
        await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
        return await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❌ 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙲𝙰𝙽 𝙾𝙽𝙻𝚈*
*┃🐢│ 𝙱𝙴 𝚄𝚂𝙴𝙳 𝙱𝚈 𝙶𝚁𝙾𝚄𝙿 𝙰𝙳𝙼𝙸𝙽𝚂*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }

    // 🤖 Bot admin check
    if (!isBotAdmins) {
        await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
        return await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❌ 𝙵𝙸𝚁𝚂𝚃 𝙼𝙰𝙺𝙴 𝙼𝙴 𝙰𝙳𝙼𝙸𝙽*
*┃🐢│ 𝙸𝙽 𝚃𝙷𝙸𝚂 𝙶𝚁𝙾𝚄𝙿*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }

    // 🧩 Number detection
    let number;
    if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quotedMsg = mek.message.extendedTextMessage.contextInfo;
        if (quotedMsg.participant) {
            number = quotedMsg.participant.split("@")[0];
        }
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        number = mek.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0];
    }

    if (!number) {
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
        return await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❓ 𝚆𝙷𝙸𝙲𝙷 𝙰𝙳𝙼𝙸𝙽 𝙳𝙾 𝚈𝙾𝚄*
*┃🐢│ 𝚆𝙰𝙽𝚃 𝚃𝙾 𝙳𝙸𝚂𝙼𝙸𝚂𝚂?*
*┃🐢│ 📝 .𝚍𝚎𝚖𝚘𝚝𝚎 @𝚞𝚜𝚎𝚛*
*┃🐢│ 💬 𝙾𝚁 𝚁𝙴𝙿𝙻𝚈 𝚃𝙾 𝚃𝙷𝙴𝙸𝚁 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }

    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (number === botJid.split("@")[0]) {
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        return await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❌ 𝚂𝙾𝚁𝚁𝚈, 𝚈𝙾𝚄 𝙲𝙰𝙽'𝚃*
*┃🐢│ 𝚁𝙴𝙼𝙾𝚅𝙴 𝙼𝙴 𝙵𝚁𝙾𝙼 𝙰𝙳𝙼𝙸𝙽*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }

    const jid = number + "@s.whatsapp.net";

    try {
        // 👇 Demote user
        await conn.groupParticipantsUpdate(from, [jid], "demote");

        await conn.sendMessage(from, { react: { text: "☹️", key: mek.key } });
        await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ✅ @${number} 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽*
*┃🐢│ 𝙳𝙸𝚂𝙼𝙸𝚂𝚂𝙴𝙳 𝙵𝚁𝙾𝙼 𝙰𝙳𝙼𝙸𝙽*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        }, { quoted: conn.fkontak });

    } catch (error) {
        console.error("❌ DEMOTE ERROR:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        await conn.sendMessage(from, { 
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ ❌ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝙳𝙴𝙼𝙾𝚃𝙴*
*┃🐢│ 🔄 𝙿𝙻𝙴𝙰𝚂𝙴 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽*
*╰━━━━━━━━━━━━━━━┈⊷*
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        }, { quoted: conn.fkontak });
    }
});
