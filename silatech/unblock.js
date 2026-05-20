// silatech/unblock.js
cmd({
    pattern: "unblock",
    alias: ["unban"],
    react: "🔓",
    desc: "Unblock a user",
    category: "owner",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const sender = mek.key.participant || mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🔓", key: mek.key } });

    // Owner check - using fromMe or owner list
    const fromMe = mek.key.fromMe;
    if (!fromMe) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for bot owner

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
    
    let jid;
    
    // Check kama kuna quoted message
    if (quoted) {
        jid = quoted;
    }
    // Check kama kuna mentioned users
    else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        jid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Check kama kuna argument (namba)
    else if (q) {
        let number = q.replace(/[^0-9]/g, '');
        if (number.startsWith('0')) {
            number = '255' + number.substring(1);
        }
        if (!number.includes('@')) {
            number = number + '@s.whatsapp.net';
        }
        jid = number;
    } else {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚄𝙽𝙱𝙻𝙾𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please reply to a message, mention a user, or provide a number*
*┃🐢│ • 📝 example: .unblock 255789661031*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }
    
    try {
        await conn.updateBlockStatus(jid, "unblock");
        
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝚄𝙽𝙱𝙻𝙾𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 🔓 user has been unblocked*
*┃🐢│ • 👤 @${jid.split('@')[0]}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [jid]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        
    } catch (e) {
        console.error('Unblock error:', e);
        await conn.sendMessage(from, {
            text: `❌ failed to unblock user

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});