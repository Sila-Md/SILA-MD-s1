// silatech/group.js

// ==================== ADD COMMAND ====================
cmd({
    pattern: "add",
    alias: ["adduser", "invite"],
    react: "➕",
    desc: "Add user to group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "➕", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    if (!q && !mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙰𝙳𝙳 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please mention or provide a number*
*┃🐢│ • 📝 example: .add 255789661031*
*┃🐢│ • 👥 or mention the user*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let users = [];
    if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        users = mek.message.extendedTextMessage.contextInfo.mentionedJid;
    } else if (q) {
        const numbers = q.split(' ').map(num => num.replace(/[^0-9]/g, '')).filter(num => num.length > 0);
        for (let number of numbers) {
            if (number.startsWith('0')) {
                number = '255' + number.substring(1);
            }
            users.push(number + '@s.whatsapp.net');
        }
    }

    if (users.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ no valid users found

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const added = [];
    const failed = [];

    for (let user of users) {
        try {
            await conn.groupParticipantsUpdate(from, [user], "add");
            added.push(user.split('@')[0]);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            failed.push(user.split('@')[0]);
        }
    }

    let result = `*╭━━〔 🐢 𝙰𝙳𝙳 🐢 〕━━┈⊷*
*┃🐢│ • ✅ users added: ${added.length}*
*┃🐢│ • ❌ failed: ${failed.length}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    if (added.length > 0) {
        result = `*╭━━〔 🐢 𝙰𝙳𝙳 🐢 〕━━┈⊷*
*┃🐢│ • ✅ successfully added:*
${added.map(num => `*┃🐢│    • +${num}*`).join('\n')}
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;
    }

    await conn.sendMessage(from, {
        text: result,
        contextInfo: conn.forwardContext,
        mentions: users
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== HIDETAG COMMAND ====================
cmd({
    pattern: "hidetag",
    alias: ["htag", "silenttag"],
    react: "🏷️",
    desc: "Tag all members invisibly",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "🏷️", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const message = q || "📢 attention all members!";
    const mentions = participants.map(p => p.id);

    await conn.sendMessage(from, {
        text: message,
        mentions: mentions,
        contextInfo: conn.forwardContext
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== TAG COMMAND ====================
cmd({
    pattern: "tag",
    alias: ["tagall", "everyone"],
    react: "👥",
    desc: "Tag all members",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "👥", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const message = q || "📢 attention!";
    const mentions = participants.map(p => p.id);
    
    const emojis = ["🌺", "🌹", "🌟", "🌝", "🍒", "🍥", "🍷"];
    
    let tagMessage = `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝚃𝙰𝙶 🐢 〕━━┈⊷*
*┃🐢│ • 📝 ${message}*
*┃🐢│ • 👥 members: ${participants.length}*
*╰━━━━━━━━━━━━━━━┈⊷*

*┌─────────────────────┈⊷*`;

    for (let i = 0; i < Math.min(20, participants.length); i++) {
        const emoji = emojis[i % emojis.length];
        tagMessage += `\n*┃🐢│ ${emoji} @${participants[i].id.split('@')[0]}*`;
    }

    if (participants.length > 20) {
        tagMessage += `\n*┃🐢│ ... and ${participants.length - 20} more*`;
    }

    tagMessage += `\n*└─────────────────────┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    await conn.sendMessage(from, {
        text: tagMessage,
        mentions: mentions,
        contextInfo: conn.forwardContext
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== TAGADMIN COMMAND ====================
cmd({
    pattern: "tagadmin",
    alias: ["tadmin", "admintag"],
    react: "👑",
    desc: "Tag all admins",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const message = q || "📢 attention admins!";
    const adminList = groupAdmins.map(admin => `@${admin.split('@')[0]}`).join(' ');

    const adminTagMsg = `*╭━━〔 🐢 𝙰𝙳𝙼𝙸𝙽 𝚃𝙰𝙶 🐢 〕━━┈⊷*
*┃🐢│ • 📝 ${message}*
*┃🐢│ • 👑 admins: ${adminList}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    await conn.sendMessage(from, {
        text: adminTagMsg,
        mentions: groupAdmins,
        contextInfo: conn.forwardContext
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== GROUPJID COMMAND ====================
cmd({
    pattern: "groupjid",
    alias: ["gcid", "groupid"],
    react: "🆔",
    desc: "Get group ID",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    await conn.sendMessage(from, { react: { text: "🆔", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);

    await conn.sendMessage(from, {
        text: `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝙸𝙳 🐢 〕━━┈⊷*
*┃🐢│ • 🏷️ name: ${groupData.subject}*
*┃🐢│ • 🆔 jid: ${from}*
*┃🐢│ • 👥 members: ${participants.length}*
*┃🐢│ • 👑 admins: ${groupAdmins.length}*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
        contextInfo: conn.forwardContext
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== LISTADMIN COMMAND ====================
cmd({
    pattern: "listadmin",
    alias: ["admins", "adminlist"],
    react: "📋",
    desc: "List all admins",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    await conn.sendMessage(from, { react: { text: "📋", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);

    let adminList = `*╭━━〔 🐢 𝙶𝚁𝙾𝚄𝙿 𝙰𝙳𝙼𝙸𝙽𝚂 🐢 〕━━┈⊷*`;

    for (let i = 0; i < groupAdmins.length; i++) {
        adminList += `\n*┃🐢│ ${i + 1}. @${groupAdmins[i].split('@')[0]}*`;
    }

    adminList += `\n*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`;

    await conn.sendMessage(from, {
        text: adminList,
        mentions: groupAdmins,
        contextInfo: conn.forwardContext
    });
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
});

// ==================== LEAVE COMMAND ====================
cmd({
    pattern: "leave",
    alias: ["exit", "left"],
    react: "🚪",
    desc: "Bot leaves the group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;

    await conn.sendMessage(from, { react: { text: "🚪", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);
    const fromMe = mek.key.fromMe;

    if (!isAdmins && !fromMe) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin or owner

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    await conn.sendMessage(from, {
        text: `*╭━━〔 🐢 𝙻𝙴𝙰𝚅𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 🚪 bot is leaving this group*
*┃🐢│ • 👋 goodbye!*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
        contextInfo: conn.forwardContext
    });

    await conn.sendMessage(from, { react: { text: "👋", key: mek.key } });
    await conn.groupLeave(from);
});

// ==================== PROMOTE COMMAND ====================
cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "setadmin"],
    react: "👑",
    desc: "Promote a member to admin",
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
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let user;
    if (quoted) {
        user = quoted;
    } else if (q && q.includes("@")) {
        user = q.replace(/[@\s]/g, "") + "@s.whatsapp.net";
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        user = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!user) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please mention or reply to the user*
*┃🐢│ • 📝 example: .promote @user*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (user === botJid) {
        return await conn.sendMessage(from, {
            text: `❌ you cannot promote the bot

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [user], "promote");
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙿𝚁𝙾𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ @${user.split('@')[0]} has been promoted to admin*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [user]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        await conn.sendMessage(from, {
            text: `❌ failed to promote user

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== DEMOTE COMMAND ====================
cmd({
    pattern: "demote",
    alias: ["d", "removeadmin"],
    react: "🔻",
    desc: "Demote an admin to member",
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
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let user;
    if (quoted) {
        user = quoted;
    } else if (q && q.includes("@")) {
        user = q.replace(/[@\s]/g, "") + "@s.whatsapp.net";
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        user = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!user) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please mention or reply to the admin*
*┃🐢│ • 📝 example: .demote @admin*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (user === botJid) {
        return await conn.sendMessage(from, {
            text: `❌ you cannot demote the bot

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [user], "demote");
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙳𝙴𝙼𝙾𝚃𝙴 🐢 〕━━┈⊷*
*┃🐢│ • ✅ @${user.split('@')[0]} has been demoted from admin*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [user]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        await conn.sendMessage(from, {
            text: `❌ failed to demote user

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});

// ==================== KICK COMMAND ====================
cmd({
    pattern: "kick",
    alias: ["remove", "delete"],
    react: "👢",
    desc: "Remove a member from group",
    category: "group",
}, async (conn, mek, args, botNumber) => {
    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.participant || mek.key.remoteJid;
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const q = args.join(" ");

    await conn.sendMessage(from, { react: { text: "👢", key: mek.key } });

    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ this command is only for groups

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const groupData = await conn.groupMetadata(from).catch(() => null);
    if (!groupData) {
        return await conn.sendMessage(from, {
            text: `❌ failed to get group info

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const participants = groupData.participants;
    const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
    const isAdmins = groupAdmins.includes(sender);

    if (!isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ you need to be an admin

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    let user;
    if (quoted) {
        user = quoted;
    } else if (q && q.includes("@")) {
        user = q.replace(/[@\s]/g, "") + "@s.whatsapp.net";
    } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        user = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!user) {
        return await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙺𝙸𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 📝 please mention or reply to the user*
*┃🐢│ • 📝 example: .kick @user*
*╰━━━━━━━━━━━━━━━┈⊷*

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    const botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    if (user === botJid) {
        return await conn.sendMessage(from, {
            text: `❌ you cannot kick the bot

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
    }

    try {
        await conn.groupParticipantsUpdate(from, [user], "remove");
        await conn.sendMessage(from, {
            text: `*╭━━〔 🐢 𝙺𝙸𝙲𝙺 🐢 〕━━┈⊷*
*┃🐢│ • 👢 @${user.split('@')[0]} has been removed from the group*
*╰━━━━━━━━━━━━━━━┈⊷*

> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext,
            mentions: [user]
        });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (error) {
        await conn.sendMessage(from, {
            text: `❌ failed to kick user

𝙶𝚎𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚋𝚘𝚝 𝚑𝚎𝚛𝚎: minibot.silatech.site/pair
> *𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐁𝐲 𝐒𝐢𝐥𝐚*`,
            contextInfo: conn.forwardContext
        });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});